package cloudflight.integra.backend.controller;

import cloudflight.integra.backend.entity.User;
import cloudflight.integra.backend.entity.UserActivity;
import cloudflight.integra.backend.service.ActivityService;
import cloudflight.integra.backend.service.UserService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService activityService;
    private final UserService userService;

    public ActivityController(ActivityService activityService, UserService userService) {
        this.activityService = activityService;
        this.userService = userService;
    }

    @GetMapping("/recent")
    public ResponseEntity<List<UserActivity>> getRecentActivities(
            @RequestParam(defaultValue = "5") int limit, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        List<UserActivity> activities = activityService.getRecentActivities(userId, limit);
        return ResponseEntity.ok(activities);
    }

    private Long getUserIdFromAuth(Authentication auth) {
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        return user.getId();
    }
}
