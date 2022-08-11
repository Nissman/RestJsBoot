package web.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import web.service.UserServiceImp;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    private final SuccessUserHandler successUserHandler;

    private UserServiceImp userServiceImp;


    @Autowired
    public WebSecurityConfig(SuccessUserHandler successUserHandler) {
        this.successUserHandler = successUserHandler;
    }

    @Autowired
    private void setUserServiceImp(UserServiceImp userServiceImp) {
        this.userServiceImp = userServiceImp;
    }

//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//                .authorizeRequests()
//                .antMatchers("/admin/**").hasRole("ADMIN")
//                .antMatchers("/user").hasAnyRole("USER", "ADMIN")
//                .antMatchers("/").permitAll()
//                .anyRequest().authenticated()
//                .and()
//                .formLogin()
//                .loginPage("/login")
//                .successHandler(successUserHandler)
//                .loginProcessingUrl("/perform-login")
//                .usernameParameter("c_email")
//                .passwordParameter("c_password")
//
//                .permitAll()
//
//                .and()
//                .logout()
//                .logoutSuccessUrl("/login?logout")
//                .permitAll()
//                .and().csrf().disable()                ;
//    }
    //for spring version 2.7.0
    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
//                .antMatchers("/admin/**").hasRole("ADMIN")
//                .antMatchers("/user").hasAnyRole("USER", "ADMIN")
//                .antMatchers("/").permitAll()
               // .antMatchers("/api/getUser").hasAnyRole("USER", "ADMIN")
//                .antMatchers("/test").permitAll()
//                .antMatchers("/static/**").permitAll()
                .anyRequest().permitAll()
                .and().httpBasic()

                .and()
                .formLogin()
                .loginPage("/login")
                                .successHandler(successUserHandler)
                .loginProcessingUrl("/perform-login")
                .usernameParameter("c_email")
                .passwordParameter("c_password")

                .permitAll()

                .and()
                .logout()
                .logoutSuccessUrl("/login?logout")
                .permitAll()
                .and().sessionManagement().disable();
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        authenticationProvider.setUserDetailsService(userServiceImp);
        return authenticationProvider;
    }

  /*


    //for spring version 2.7.0
    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/user").hasAnyRole("USER", "ADMIN")
                .antMatchers("/").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin().successHandler(successUserHandler)
                .permitAll()
                .and()
                .logout()
                .logoutSuccessUrl("/index")
                .permitAll();
        return http.build();
    }

    @Bean
    protected WebSecurityCustomizer webSecurityCustomizer() {

    }
     */
}
