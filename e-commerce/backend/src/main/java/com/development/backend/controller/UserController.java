package com.development.backend.controller;

import com.development.backend.dto.ApiResponse;
import com.development.backend.dto.AuthResponse;
import com.development.backend.dto.LoginRequest;
import com.development.backend.dto.SignUpRequest;
import com.development.backend.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(new AuthResponse(service.login(request),"successfully logged in"));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignUpRequest request){
        return ResponseEntity.ok(new AuthResponse(service.signup(request),"user created successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request){
        Claims claims = (Claims) request.getAttribute("user");
        if(claims==null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse("Not Authorized",false));

        return ResponseEntity.ok(service.me(claims.getSubject()));
    }
}
