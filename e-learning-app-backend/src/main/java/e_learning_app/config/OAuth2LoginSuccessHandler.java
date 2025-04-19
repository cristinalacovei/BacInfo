package e_learning_app.config;

import e_learning_app.model.User;
import e_learning_app.service.UserService;
import e_learning_app.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = oauthToken.getPrincipal();
        Map<String, Object> attributes = oauth2User.getAttributes();

        String email = (String) attributes.get("email");
        String firstName = (String) attributes.get("given_name");
        String lastName = (String) attributes.get("family_name");

        User user = userService.findByEmailOrCreate(email, firstName, lastName);

        String jwt = jwtUtil.generateTokenForOAuth2User(user);

        // Redirect to frontend with JWT
        String redirectUrl;
        if (user.getUserRole() == null || user.getUserRole().equals("PENDING")) {
            redirectUrl = "http://localhost:4200/oauth2/redirect?token=" + jwt + "&incomplete=true";
        } else {
            redirectUrl = "http://localhost:4200/oauth2/redirect?token=" + jwt;
        }
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}