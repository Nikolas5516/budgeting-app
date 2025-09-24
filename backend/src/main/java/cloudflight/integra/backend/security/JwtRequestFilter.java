package cloudflight.integra.backend.security;

import cloudflight.integra.backend.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final UserService userDetailsService;
    private final JwtUtils jwtUtils;

    public JwtRequestFilter(UserService userDetailsService, JwtUtils jwtUtils) {
        this.userDetailsService = userDetailsService;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Main filter method that executes once per request
     * This filter intercepts all incoming HTTP requests and checks for JWT tokens
     * in the Authorization header to authenticate users
     *
     * @param request  - the HTTP request object
     * @param response - the HTTP response object
     * @param chain    - the filter chain for passing the request to the next filter
     * @throws ServletException if there's a servlet error
     * @throws IOException      if there's an I/O error
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {

        // Get authorization header from request
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // get auth header and validate
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // get jwt token and validate
        final String token = header.split(" ")[1].trim();


        chain.doFilter(request, response);
    }
}
