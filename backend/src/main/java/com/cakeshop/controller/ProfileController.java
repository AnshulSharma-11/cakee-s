package com.cakeshop.controller;

import com.cakeshop.dto.profile.ProfileResponse;
import com.cakeshop.dto.profile.UpdateProfileRequest;
import com.cakeshop.entity.User;
import com.cakeshop.security.AuthenticatedUser;
import com.cakeshop.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ProfileResponse getMyProfile(@AuthenticationPrincipal AuthenticatedUser principal) {
        return profileService.getMyProfile(currentUser(principal));
    }

    @PutMapping("/me")
    public ProfileResponse updateMyProfile(@AuthenticationPrincipal AuthenticatedUser principal,
                                            @RequestBody UpdateProfileRequest req) {
        return profileService.updateMyProfile(currentUser(principal), req);
    }

    private User currentUser(AuthenticatedUser principal) {
        return principal.getUser();
    }
}
