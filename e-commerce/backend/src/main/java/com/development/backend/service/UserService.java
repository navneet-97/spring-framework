package com.development.backend.service;

import com.development.backend.dto.LoginRequest;
import com.development.backend.dto.SignUpRequest;
import com.development.backend.exception.InvalidCredentialsException;
import com.development.backend.model.User;
import com.development.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtService jwt;

    public String login(LoginRequest request) {
        User user=repo.findByEmail(request.getEmail())
                .orElseThrow(()->new InvalidCredentialsException("Invalid Email"));

        boolean isPasswordMatches=encoder.matches(request.getPassword(),user.getPassword());
        if(!isPasswordMatches){
            throw new InvalidCredentialsException("Invalid Password");
        }

        return jwt.generateToken(request.getEmail(), user.getRole());
    }

    public String signup(SignUpRequest request){
        boolean exists=repo.findByEmail(request.getEmail()).isPresent();
        if(exists){
            throw new InvalidCredentialsException("Email already exists");
        }

        User user=new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        String hashedPassword=encoder.encode(request.getPassword());
        user.setPassword(hashedPassword);
        repo.save(user);

        return jwt.generateToken(request.getEmail(),user.getRole());
    }

    public User me(String email){
        return repo.findByEmail(email)
                .orElseThrow(()->new InvalidCredentialsException("User doesn't exists"));
    }
}
