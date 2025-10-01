package cloudflight.integra.backend.payment;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cloudflight.integra.backend.dto.PaymentDTO;
import cloudflight.integra.backend.dto.auth.AuthenticationRequest;
import cloudflight.integra.backend.dto.auth.AuthenticationResponse;
import cloudflight.integra.backend.dto.auth.RegisterRequest;
import cloudflight.integra.backend.entity.Frequency;
import cloudflight.integra.backend.entity.Payment;
import cloudflight.integra.backend.repository.PaymentRepository;
import cloudflight.integra.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
public class PaymentRestControllerTest {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private PaymentRepository paymentRepository;
  private Payment p1;
  private Payment p2;
  private String testToken;
  @Autowired private UserRepository userRepository;

  @BeforeEach
  void setUp() throws Exception {
    List<Long> paymentsIds = new ArrayList<>();
    paymentRepository.findAll().forEach(p -> paymentsIds.add(p.getId()));
    paymentsIds.forEach(paymentRepository::delete);
    userRepository.deleteAll();
    RegisterRequest registerRequest = new RegisterRequest();
    registerRequest.setName("Test User");
    registerRequest.setEmail("test@example.com");
    registerRequest.setPassword("password123");

    mockMvc
        .perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
        .andExpect(status().isOk());

    AuthenticationRequest loginRequest = new AuthenticationRequest();
    loginRequest.setEmail("test@example.com");
    loginRequest.setPassword("password123");

    MvcResult result =
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andDo(print())
            .andReturn();

    String response = result.getResponse().getContentAsString();
    testToken = objectMapper.readValue(response, AuthenticationResponse.class).getToken();

    p1 =
        paymentRepository.save(
            new Payment(
                null, "Internet", BigDecimal.valueOf(50), Frequency.MONTHLY, new Date(), true));
    p2 =
        paymentRepository.save(
            new Payment(null, "Gym", BigDecimal.valueOf(150), Frequency.MONTHLY, new Date(), true));
  }

  @Test
  void testGetPaymentById() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/payments/" + p1.getId()).header("Authorization", "Bearer " + testToken))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(p1.getId()))
        .andExpect(jsonPath("$.name").value(p1.getName()))
        .andExpect(jsonPath("$.amount").value(p1.getAmount()));
  }

  @Test
  void testGetPaymentByIdNotFound() throws Exception {
    mockMvc
        .perform(get("/api/v1/payments/100").header("Authorization", "Bearer " + testToken))
        .andDo(print())
        .andExpect(status().isNotFound());
  }

  @Test
  void testCreatePayment() throws Exception {
    PaymentDTO paymentDTO = new PaymentDTO();
    paymentDTO.setName("Netflix");
    paymentDTO.setAmount(BigDecimal.valueOf(50));
    paymentDTO.setFrequency(Frequency.MONTHLY);
    paymentDTO.setIsActive(true);
    paymentDTO.setNextDueDate(new Date());
    mockMvc
        .perform(
            post("/api/v1/payments")
                .header("Authorization", "Bearer " + testToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.name").value("Netflix"));
  }

  @Test
  void testUpdatePayment() throws Exception {
    PaymentDTO paymentDTO = new PaymentDTO();
    paymentDTO.setId(p1.getId());
    paymentDTO.setName("HBO");
    paymentDTO.setAmount(BigDecimal.valueOf(50));
    paymentDTO.setFrequency(Frequency.MONTHLY);
    paymentDTO.setIsActive(true);
    paymentDTO.setNextDueDate(new Date());
    mockMvc
        .perform(
            put("/api/v1/payments/" + p1.getId())
                .header("Authorization", "Bearer " + testToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("HBO"));
  }

  @Test
  void testDeletePayment() throws Exception {
    mockMvc
        .perform(
            delete("/api/v1/payments/" + p2.getId()).header("Authorization", "Bearer " + testToken))
        .andDo(print())
        .andExpect(status().isOk());
    mockMvc
        .perform(
            delete("/api/v1/payments/" + p2.getId()).header("Authorization", "Bearer " + testToken))
        .andDo(print())
        .andExpect(status().isNotFound());
  }
}
