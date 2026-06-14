---
title: Clase 5 — Spring Security y Logging
type: source
created: 2026-04-15
updated: 2026-04-15
tags: [spring-security, authentication, authorization, logging, logback, slf4j]
sources: [PAW - clase 5.pdf]
---

# Clase 5 — Spring Security y Logging

**Archivo original:** `PAW - clase 5.pdf`

## Takeaways principales

- Spring Security implementa el patrón ACL: Roles, Recursos, Permisos.
- Configuración via `WebSecurityConfigurerAdapter` + `@EnableWebSecurity`.
- `DelegatingFilterProxy` intercepta todos los requests en `web.xml`.
- `UserDetailsService` carga el usuario desde la base de datos.
- `GrantedAuthority` / `SimpleGrantedAuthority` para roles — prefijo `ROLE_` requerido.
- `BCryptPasswordEncoder` recomendado para passwords en producción.
- Logback como implementación nativa de SLF4J.

## Notas detalladas

### Dependencias Spring Security (versión en curso: 5.3.13.RELEASE)

```xml
<!-- pom padre -->
<spring-security.version>5.3.13.RELEASE</spring-security.version>

<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-core</artifactId>
    <version>${spring-security.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
    <version>${spring-security.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-config</artifactId>
    <version>${spring-security.version}</version>
</dependency>
```

### web.xml: agregar WebAuthConfig y DelegatingFilterProxy

```xml
<!-- Agregar WebAuthConfig al contextConfigLocation -->
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>
        ar.edu.itba.paw.webapp.config.WebConfig,
        ar.edu.itba.paw.webapp.config.WebAuthConfig,
    </param-value>
</context-param>

<!-- Filtro de Spring Security -->
<filter>
    <filter-name>springSecurityFilterChain</filter-name>
    <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
</filter>
<filter-mapping>
    <filter-name>springSecurityFilterChain</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### WebAuthConfig

```java
@Configuration
@EnableWebSecurity
@ComponentScan("ar.edu.itba.paw.webapp.auth")
public class WebAuthConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private PawUserDetailsService userDetailsService;

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        http.userDetailsService(userDetailsService)
            .sessionManagement()
                .invalidSessionUrl("/login")
            .and().authorizeRequests()
                .antMatchers("/login").anonymous()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/**").authenticated()    // regla default — va última
            .and().formLogin()
                .usernameParameter("j_username")
                .passwordParameter("j_password")
                .defaultSuccessUrl("/", false)
                .loginPage("/login")
            .and().rememberMe()
                .rememberMeParameter("j_rememberme")
                .userDetailsService(userDetailsService)
                .key("mysupersecretkey")
                .tokenValiditySeconds((int) TimeUnit.DAYS.toSeconds(30))
            .and().logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login")
            .and().exceptionHandling()
                .accessDeniedPage("/403")
            .and().csrf().disable();
    }

    @Override
    public void configure(final WebSecurity web) throws Exception {
        web.ignoring()
            .antMatchers("/css/**", "/js/**", "/img/**", "/favicon.ico", "/403");
    }
}
```

**Orden de `antMatchers` importa:** la primera regla que coincide se aplica; las siguientes se ignoran.

### PawUserDetailsService

```java
@Component
public class PawUserDetailsService implements UserDetailsService {
    @Autowired
    private UserService us;

    @Override
    public UserDetails loadUserByUsername(final String username)
            throws UsernameNotFoundException {
        final User user = us.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("No user: " + username);
        }
        final Collection<GrantedAuthority> authorities = Arrays.asList(
            new SimpleGrantedAuthority("ROLE_USER"),
            new SimpleGrantedAuthority("ROLE_ADMIN")
        );
        return new org.springframework.security.core.userdetails.User(
            username, user.getPassword(), authorities);
    }
}
```

- Las `authorities` son un `Set` → un usuario puede tener múltiples roles.
- Los constructores de `User` permiten diferenciar: bloqueado, desactivado, password expirada.
- En prod las autoridades se generan dinámicamente desde la DB.

### Login JSP

```jsp
<c:url value="/login" var="loginUrl" />
<form action="${loginUrl}" method="post" enctype="application/x-www-form-urlencoded">
    <input name="j_username" type="text"/>
    <input name="j_password" type="password"/>
    <label><input name="j_rememberme" type="checkbox"/>
        <spring:message code="remember_me"/></label>
    <input type="submit" value="Login!"/>
</form>
```

### PasswordEncoder

- Default en el ejemplo: `PlainTextPasswordEncoder` (solo para demos).
- **En producción usar `BCryptPasswordEncoder`** y hashearlo al crear/modificar passwords.

### Logback (SLF4J)

```xml
<!-- pom padre -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.5</version>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.1.2</version>
</dependency>
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>jcl-over-slf4j</artifactId>
    <version>1.7.5</version>
</dependency>
<dependency>
    <groupId>org.logback-extensions</groupId>
    <artifactId>logback-ext-spring</artifactId>
    <version>0.1.1</version>
    <scope>runtime</scope>
</dependency>
```

`logback.xml` básico (desarrollo):
```xml
<configuration>
    <property name="defaultPattern" value="%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"/>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder><pattern>${defaultPattern:-}</pattern></encoder>
    </appender>
    <root level="DEBUG">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```

Uso en código:
```java
private static final Logger LOGGER = LoggerFactory.getLogger(MiClase.class);
LOGGER.debug("Usuario logueado: {}", user);  // {} es placeholder, no concatenar Strings
```

Usar `Logger` y `LoggerFactory` de SLF4J (no de Logback directamente).
