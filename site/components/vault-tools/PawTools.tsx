"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Panel,
  SubPanel,
  Note,
  CodeBlock,
  Chip,
  TextInput,
} from "@studyvaults/ui";
import ToolkitShell, { type Tool } from "./ToolkitShell";

/* ------------------------------------------------------------------ *
 * Programación de Aplicaciones Web — study toolkit
 * Spring MVC + JSP/JSTL reference, taught in English.
 * Three tools: snippet cheatsheet, request lifecycle diagram,
 * and an EL & JSTL / annotations reference.
 * Pure render from state → SSR-safe (static export). No external libs.
 * ------------------------------------------------------------------ */

/* =================================================================== *
 * Copy button (clipboard guarded behind an event handler)
 * =================================================================== */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function onCopy() {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    };
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        navigator.clipboard.writeText(text).then(done).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    } catch {
      fallbackCopy();
    }

    function fallbackCopy() {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done();
      } catch {
        /* clipboard unavailable — silently ignore */
      }
    }
  }

  return (
    <button
      type="button"
      className={`vtool-copy${copied ? " copied" : ""}`}
      onClick={onCopy}
      aria-label="Copy code to clipboard"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

/* =================================================================== *
 * Tool 1 — Snippet cheatsheet
 * =================================================================== */

interface Snippet {
  category: string;
  title: string;
  code: string;
  note?: string;
}

const SNIPPETS: Snippet[] = [
  /* --- Controllers --- */
  {
    category: "Controllers",
    title: "@Controller + @RequestMapping (class + method)",
    code: `@Controller
@RequestMapping("/rentals")
public class RentalController {

    private final RentalService rentalService;

    @Autowired
    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @GetMapping
    public ModelAndView list() {
        final ModelAndView mav = new ModelAndView("rentals/list");
        mav.addObject("rentals", rentalService.findAll());
        return mav;
    }
}`,
    note: "Class-level @RequestMapping prefixes every handler. Inject collaborators through the constructor, not field injection.",
  },
  {
    category: "Controllers",
    title: "@GetMapping / @PostMapping",
    code: `@GetMapping("/{id}")
public ModelAndView detail(@PathVariable long id) {
    final Slope slope = slopeService.findById(id)
            .orElseThrow(SlopeNotFoundException::new);
    return new ModelAndView("slopes/detail")
            .addObject("slope", slope);
}

@PostMapping("/{id}/book")
public ModelAndView book(@PathVariable long id,
                         @RequestParam("date") String date) {
    bookingService.book(id, LocalDate.parse(date));
    return new ModelAndView("redirect:/rentals");
}`,
    note: "@GetMapping(\"/x\") is shorthand for @RequestMapping(value=\"/x\", method=RequestMethod.GET). Prefer a redirect after a successful POST (PRG pattern).",
  },
  /* --- Request data --- */
  {
    category: "Request data",
    title: "@RequestParam / @PathVariable",
    code: `@GetMapping("/search")
public ModelAndView search(
        @RequestParam(value = "q", required = false, defaultValue = "") String q,
        @RequestParam(value = "page", defaultValue = "1") int page) {

    final List<Slope> results = slopeService.search(q, page);
    return new ModelAndView("slopes/search")
            .addObject("query", q)
            .addObject("results", results);
}

@GetMapping("/resorts/{resort}/slopes/{slopeId}")
public ModelAndView nested(@PathVariable String resort,
                           @PathVariable long slopeId) {
    /* both segments are bound from the URL template */
    return new ModelAndView("slopes/detail");
}`,
    note: "@RequestParam reads ?q=… query/form params; @PathVariable binds {…} URL template segments. Use required=false + defaultValue for optional params.",
  },
  {
    category: "Request data",
    title: "Model vs ModelAndView",
    code: `// Option A — return a view name, populate the Model argument
@GetMapping("/profile")
public String profile(Model model, Principal principal) {
    model.addAttribute("user", userService.findByEmail(principal.getName()));
    return "user/profile";          // logical view name
}

// Option B — build a ModelAndView and return it
@GetMapping("/profile2")
public ModelAndView profile2(Principal principal) {
    return new ModelAndView("user/profile")
            .addObject("user", userService.findByEmail(principal.getName()));
}`,
    note: "Model attributes become EL variables in the JSP (${user}). Both styles are equivalent — pick one per project for consistency.",
  },
  {
    category: "Request data",
    title: "@ModelAttribute (command object + shared data)",
    code: `// Prepare a backing command object for the form view
@ModelAttribute("registerForm")
public RegisterForm registerForm() {
    return new RegisterForm();
}

@GetMapping("/register")
public ModelAndView registerForm() {
    return new ModelAndView("user/register");
}

// Bind submitted fields onto the same command object
@PostMapping("/register")
public ModelAndView register(
        @Valid @ModelAttribute("registerForm") RegisterForm form,
        BindingResult errors) {
    if (errors.hasErrors()) {
        return registerForm();      // re-render with field errors
    }
    userService.create(form.getEmail(), form.getPassword());
    return new ModelAndView("redirect:/login");
}`,
    note: "A method-level @ModelAttribute runs before every handler and seeds the model. The form: tag in the JSP binds against the same attribute name.",
  },
  /* --- Validation --- */
  {
    category: "Validation",
    title: "JSR-303 command object",
    code: `public class RegisterForm {

    @NotNull
    @Email(message = "Must be a valid email")
    private String email;

    @NotNull
    @Size(min = 8, max = 100, message = "8–100 characters")
    private String password;

    @Size(min = 1, message = "Required")
    private String repeatPassword;

    // getters / setters …
}`,
    note: "Constraints from javax.validation.constraints / hibernate-validator. message attributes are surfaced to the view through BindingResult.",
  },
  {
    category: "Validation",
    title: "@Valid + BindingResult in the handler",
    code: `@PostMapping("/register")
public ModelAndView register(@Valid @ModelAttribute("form") RegisterForm form,
                             final BindingResult errors) {
    // Cross-field check
    if (!form.getPassword().equals(form.getRepeatPassword())) {
        errors.rejectValue("repeatPassword", "register.passwordMismatch",
                "Passwords do not match");
    }
    if (errors.hasErrors()) {
        return new ModelAndView("user/register");
    }
    userService.create(form.getEmail(), form.getPassword());
    return new ModelAndView("redirect:/login");
}`,
    note: "BindingResult MUST be the parameter immediately after the @Valid object. Use rejectValue(...) for custom / cross-field errors.",
  },
  {
    category: "Validation",
    title: "Rendering errors in the JSP (Spring form taglib)",
    code: `<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<form:form modelAttribute="form" action="/register" method="post">
    <label>Email</label>
    <form:input path="email" type="email"/>
    <form:errors path="email" cssClass="field-error"/>

    <label>Password</label>
    <form:password path="password"/>
    <form:errors path="password" cssClass="field-error"/>

    <button type="submit">Sign up</button>
</form:form>`,
    note: "modelAttribute must match the command object name. <form:errors> renders the messages produced by @Valid / rejectValue.",
  },
  /* --- JSP / JSTL --- */
  {
    category: "JSP / JSTL",
    title: "<c:forEach> with status",
    code: `<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<table>
  <c:forEach var="slope" items="\${slopes}" varStatus="loop">
    <tr class="\${loop.index % 2 == 0 ? 'even' : 'odd'}">
      <td>\${loop.count}</td>
      <td><c:out value="\${slope.name}"/></td>
      <td>\${slope.difficulty}</td>
    </tr>
  </c:forEach>
</table>`,
    note: "varStatus exposes index (0-based), count (1-based), first and last. Always wrap user data in <c:out> to escape HTML.",
  },
  {
    category: "JSP / JSTL",
    title: "<c:if> and <c:choose>",
    code: `<c:if test="\${not empty rentals}">
    <p>You have \${fn:length(rentals)} active rentals.</p>
</c:if>

<c:choose>
    <c:when test="\${slope.difficulty == 'BLACK'}">
        <span class="badge danger">Expert</span>
    </c:when>
    <c:when test="\${slope.difficulty == 'RED'}">
        <span class="badge warn">Advanced</span>
    </c:when>
    <c:otherwise>
        <span class="badge">Beginner</span>
    </c:otherwise>
</c:choose>`,
    note: "<c:if> has no else — use <c:choose>/<c:when>/<c:otherwise> for branches. fn:length needs the JSTL functions taglib (prefix fn).",
  },
  {
    category: "JSP / JSTL",
    title: "<fmt:> formatting & i18n",
    code: `<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<fmt:setLocale value="\${pageContext.response.locale}"/>
<fmt:setBundle basename="messages"/>

<p><fmt:message key="rental.price.label"/>:
   <fmt:formatNumber value="\${rental.price}" type="currency" currencyCode="USD"/></p>

<p><fmt:formatDate value="\${rental.startDate}" pattern="dd/MM/yyyy"/></p>`,
    note: "<fmt:message> resolves keys from a ResourceBundle (messages_en.properties). formatNumber/formatDate localize values for the request locale.",
  },
  {
    category: "JSP / JSTL",
    title: "EL — expression language essentials",
    code: `\${rental.slope.name}          <%-- nested bean property access --%>
\${rentals[0].price}           <%-- list / array indexing --%>
\${param.q}                    <%-- request parameter ?q= --%>
\${not empty errors}           <%-- empty test on lists/strings/maps --%>
\${user.admin ? 'Admin' : 'User'}   <%-- ternary --%>
\${pageContext.request.contextPath}/css/app.css   <%-- context path --%>`,
    note: "EL is null-safe: ${a.b.c} yields empty rather than throwing on a null link. Use ${pageContext.request.contextPath} so URLs survive a context rename.",
  },
  /* --- Security --- */
  {
    category: "Security",
    title: "SecurityFilterChain (Spring Security 5.7+)",
    code: `@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/register", "/css/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/rentals", true)
                .failureUrl("/login?error=true"))
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/"))
            .rememberMe(rm -> rm.key("rent-the-slopes").tokenValiditySeconds(1209600));
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}`,
    note: "The lambda DSL replaces the deprecated WebSecurityConfigurerAdapter. requestMatchers(...) replaces the old antMatchers(...). Order matters: most specific first.",
  },
  {
    category: "Security",
    title: "antMatchers DSL (older Spring Security)",
    code: `@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
            .antMatchers("/", "/login", "/register").permitAll()
            .antMatchers("/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        .and()
        .formLogin()
            .loginPage("/login")
            .usernameParameter("email")
            .passwordParameter("password")
            .defaultSuccessUrl("/", false)
        .and()
        .logout().logoutUrl("/logout").logoutSuccessUrl("/");
}`,
    note: "Pre-5.7 style extending WebSecurityConfigurerAdapter. usernameParameter lets the login form post 'email' instead of the default 'username'.",
  },
  {
    category: "Security",
    title: "Login form JSP",
    code: `<form action="\${pageContext.request.contextPath}/login" method="post">
    <c:if test="\${param.error != null}">
        <p class="field-error">Invalid email or password.</p>
    </c:if>

    <input type="email"    name="username" placeholder="Email" required/>
    <input type="password" name="password" placeholder="Password" required/>
    <label><input type="checkbox" name="remember-me"/> Remember me</label>

    <%-- CSRF token: required when CSRF protection is enabled --%>
    <input type="hidden" name="\${_csrf.parameterName}" value="\${_csrf.token}"/>

    <button type="submit">Log in</button>
</form>`,
    note: "Field names must match usernameParameter/passwordParameter. Always emit the ${_csrf} hidden field on POST forms unless CSRF is disabled.",
  },
  /* --- Exceptions --- */
  {
    category: "Exceptions",
    title: "@ExceptionHandler (controller-local)",
    code: `@ExceptionHandler(SlopeNotFoundException.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
public ModelAndView notFound(SlopeNotFoundException ex) {
    final ModelAndView mav = new ModelAndView("errors/404");
    mav.addObject("message", ex.getMessage());
    return mav;
}`,
    note: "Handles exceptions thrown by handlers in the same @Controller. @ResponseStatus sets the HTTP status of the response.",
  },
  {
    category: "Exceptions",
    title: "@ControllerAdvice (global handler)",
    code: `@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SlopeNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ModelAndView handleNotFound() {
        return new ModelAndView("errors/404");
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ModelAndView handleForbidden() {
        return new ModelAndView("errors/403");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ModelAndView handleGeneric(Exception ex) {
        return new ModelAndView("errors/500")
                .addObject("message", ex.getMessage());
    }
}`,
    note: "@ControllerAdvice applies across all controllers. Most-specific exception type wins; keep a catch-all Exception handler last.",
  },
];

const CATEGORIES = Array.from(new Set(SNIPPETS.map((s) => s.category)));

function SnippetTool() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SNIPPETS.filter((s) => {
      if (cat && s.category !== cat) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.note ? s.note.toLowerCase().includes(q) : false)
      );
    });
  }, [query, cat]);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Snippet cheatsheet</h3>
        <p>
          Copy-ready Spring MVC + JSP patterns from the Rent-The-Slopes stack.
          Search by title, category, or code — then copy.
        </p>
      </div>

      <div className="vtool-stack">
        <div className="vtool-field">
          <label className="vtool-label" htmlFor="paw-snip-search">
            <b>Search</b>
            <span>
              {filtered.length} / {SNIPPETS.length}
            </span>
          </label>
          <TextInput
            id="paw-snip-search"
            placeholder="e.g. @Valid, forEach, SecurityFilterChain, @PathVariable…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        <div className="vtool-row" role="group" aria-label="Filter by category">
          <Chip active={cat === null} onClick={() => setCat(null)}>
            All
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={cat === c}
              onClick={() => setCat(cat === c ? null : c)}
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Note tone="error">
          No snippets match “{query}”
          {cat ? ` in ${cat}` : ""}. Clear the search or pick another category.
        </Note>
      ) : (
        <div className="vtool-stack" style={{ marginTop: 18, gap: 18 }}>
          {filtered.map((s) => (
            <SubPanel key={`${s.category}-${s.title}`}>
              <div className="vtool-head" style={{ marginBottom: 12 }}>
                <div>
                  <div className="vtool-eyebrow">{s.category}</div>
                  <h3 style={{ fontSize: 17, marginTop: 4 }}>{s.title}</h3>
                </div>
                <CopyButton text={s.code} />
              </div>
              <CodeBlock>{s.code}</CodeBlock>
              {s.note && <Note>{s.note}</Note>}
            </SubPanel>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* =================================================================== *
 * Tool 2 — Request lifecycle diagram (interactive SVG)
 * =================================================================== */

interface Stage {
  key: string;
  label: string;
  sub: string;
  what: string;
  classes: string[];
}

const STAGES: Stage[] = [
  {
    key: "client",
    label: "Client",
    sub: "Browser",
    what: "The browser issues an HTTP request (GET /rentals). It travels over the network to the servlet container (Tomcat) where the web app is deployed.",
    classes: ["HttpServletRequest", "Tomcat / servlet container", "web.xml"],
  },
  {
    key: "dispatcher",
    label: "DispatcherServlet",
    sub: "Front controller",
    what: "The single front controller for the app. It receives every request, then orchestrates handler mapping, handler execution, view resolution and rendering. Configured once in web.xml (or via WebApplicationInitializer).",
    classes: ["DispatcherServlet", "WebApplicationContext", "<servlet-mapping> /"],
  },
  {
    key: "mapping",
    label: "HandlerMapping",
    sub: "Route → handler",
    what: "Inspects the request (URL, HTTP method, params) and decides which controller method should handle it. For annotated controllers this is RequestMappingHandlerMapping, driven by @RequestMapping / @GetMapping metadata.",
    classes: ["RequestMappingHandlerMapping", "@RequestMapping", "HandlerExecutionChain"],
  },
  {
    key: "controller",
    label: "Controller",
    sub: "@Controller",
    what: "Your handler method runs. Spring binds @RequestParam / @PathVariable / @ModelAttribute, validates @Valid command objects, calls the service layer, populates the Model and returns a logical view name (or ModelAndView).",
    classes: ["@Controller", "@GetMapping / @PostMapping", "Model / ModelAndView"],
  },
  {
    key: "service",
    label: "Service / Model",
    sub: "Business logic",
    what: "The controller delegates to the service layer for business logic and persistence (@Service → DAO / @Repository). Results are placed on the Model as attributes that the view will read.",
    classes: ["@Service", "@Repository / DAO", "@Transactional"],
  },
  {
    key: "resolver",
    label: "ViewResolver",
    sub: "Name → View",
    what: "Translates the logical view name (\"rentals/list\") into a concrete View. InternalResourceViewResolver typically maps it to /WEB-INF/jsp/rentals/list.jsp using a configured prefix and suffix.",
    classes: ["InternalResourceViewResolver", "prefix /WEB-INF/jsp/", "suffix .jsp"],
  },
  {
    key: "view",
    label: "JSP View",
    sub: "Render HTML",
    what: "The JSP executes: EL reads Model attributes (${rentals}), JSTL tags iterate and branch, the Spring form taglib renders bound fields and validation errors. The output is an HTML document.",
    classes: ["JSP + JSTL", "EL ${...}", "form / c / fmt taglibs"],
  },
  {
    key: "response",
    label: "Response",
    sub: "HTTP 200",
    what: "DispatcherServlet writes the rendered HTML back into the HttpServletResponse. The container streams the response to the browser, which paints the page.",
    classes: ["HttpServletResponse", "text/html", "HTTP status + body"],
  },
];

function LifecycleTool() {
  const [selected, setSelected] = useState(STAGES[0].key);
  const cur = STAGES.find((s) => s.key === selected) ?? STAGES[0];

  // Geometry — 4 columns × 2 rows of stage boxes inside a viewBox.
  const VB_W = 860;
  const cols = 4;
  const boxW = 184;
  const boxH = 64;
  const gapX = (VB_W - cols * boxW) / (cols + 1);
  const gapY = 46;
  const topPad = 18;
  const rows = Math.ceil(STAGES.length / cols);
  const VB_H = topPad * 2 + rows * boxH + (rows - 1) * gapY;

  const placed = STAGES.map((s, i) => {
    const row = Math.floor(i / cols);
    const colInRow = i % cols;
    // Snake/boustrophedon layout so arrows flow L→R then R→L.
    const visualCol = row % 2 === 0 ? colInRow : cols - 1 - colInRow;
    const x = gapX + visualCol * (boxW + gapX);
    const y = topPad + row * (boxH + gapY);
    return { ...s, x, y, row, colInRow, visualCol };
  });

  function byKey(k: string) {
    return placed.find((p) => p.key === k)!;
  }

  // Build connectors between consecutive stages.
  const connectors: ReactNode[] = [];
  for (let i = 0; i < placed.length - 1; i++) {
    const a = placed[i];
    const b = placed[i + 1];
    if (a.row === b.row) {
      // Horizontal arrow within the same row.
      const leftToRight = a.x < b.x;
      const x1 = leftToRight ? a.x + boxW : a.x;
      const x2 = leftToRight ? b.x : b.x + boxW;
      const y = a.y + boxH / 2;
      connectors.push(
        <line
          key={`c-${i}`}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke="var(--hairline-strong)"
          strokeWidth={1.5}
          markerEnd="url(#paw-arrow)"
        />
      );
    } else {
      // Vertical drop to the next row (same visual column where the snake turns).
      const x = a.x + boxW / 2;
      connectors.push(
        <line
          key={`c-${i}`}
          x1={x}
          y1={a.y + boxH}
          x2={x}
          y2={b.y}
          stroke="var(--hairline-strong)"
          strokeWidth={1.5}
          markerEnd="url(#paw-arrow)"
        />
      );
    }
  }

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Request lifecycle</h3>
        <p>
          How a request flows through Spring MVC. Click a stage to highlight it
          and read what it does.
        </p>
      </div>

      <div className="vtool-plot">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Spring MVC request lifecycle diagram"
        >
          <defs>
            <marker
              id="paw-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-secondary)" />
            </marker>
          </defs>

          {connectors}

          {placed.map((s) => {
            const active = s.key === selected;
            return (
              <g
                key={s.key}
                onClick={() => setSelected(s.key)}
                style={{ cursor: "pointer" }}
                role="button"
                aria-pressed={active}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(s.key);
                  }
                }}
              >
                <rect
                  x={s.x}
                  y={s.y}
                  width={boxW}
                  height={boxH}
                  rx={9}
                  fill={
                    active
                      ? "color-mix(in srgb, var(--vault-tint, var(--primary)) 16%, var(--surface-2))"
                      : "var(--surface-2)"
                  }
                  stroke={
                    active
                      ? "var(--vault-tint, var(--primary))"
                      : "var(--hairline-strong)"
                  }
                  strokeWidth={active ? 2 : 1}
                />
                <text
                  x={s.x + boxW / 2}
                  y={s.y + 26}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={13}
                  fontWeight={600}
                  fill={active ? "var(--ink-strong)" : "var(--text-primary)"}
                >
                  {s.label}
                </text>
                <text
                  x={s.x + boxW / 2}
                  y={s.y + 45}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10.5}
                  fill="var(--text-secondary)"
                >
                  {s.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <SubPanel style={{ marginTop: 18 }}>
        <div className="vtool-eyebrow">
          Stage {STAGES.findIndex((s) => s.key === cur.key) + 1} of{" "}
          {STAGES.length}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: 19,
            color: "var(--ink-strong)",
            margin: "4px 0 8px",
          }}
        >
          {cur.label}
        </h3>
        <p
          style={{
            margin: 0,
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {cur.what}
        </p>
        <div className="vtool-row" style={{ marginTop: 12 }}>
          {cur.classes.map((c) => (
            <span key={c} className="vtool-mono">
              {c}
            </span>
          ))}
        </div>
      </SubPanel>

      <Note>
        DispatcherServlet is the front controller orchestrating every step. A{" "}
        <span className="vtool-mono">return &quot;redirect:/…&quot;</span> short-circuits
        view rendering and starts a fresh request (the POST-Redirect-GET
        pattern).
      </Note>
    </Panel>
  );
}

/* =================================================================== *
 * Tool 3 — EL & JSTL reference
 * =================================================================== */

interface RefRow {
  a: string;
  b: string;
  c: string;
}

const EL_OPERATORS: RefRow[] = [
  { a: ".", b: "Bean property access (getName())", c: "${rental.slope.name}" },
  { a: "[ ]", b: "Index / dynamic property", c: "${rentals[0]} · ${map['key']}" },
  { a: "== eq", b: "Equality", c: "${user.role == 'ADMIN'}" },
  { a: "!= ne", b: "Inequality", c: "${status ne 'PAID'}" },
  { a: "< > <= >= lt gt le ge", b: "Comparison", c: "${rental.price gt 100}" },
  { a: "&& and", b: "Logical AND", c: "${a and b}" },
  { a: "|| or", b: "Logical OR", c: "${a or b}" },
  { a: "! not", b: "Logical NOT", c: "${not empty list}" },
  { a: "empty", b: "Null / zero-length test", c: "${empty errors}" },
  { a: "? :", b: "Ternary conditional", c: "${admin ? 'Yes' : 'No'}" },
  { a: "+ - * / div % mod", b: "Arithmetic", c: "${total div count}" },
];

const EL_IMPLICIT: RefRow[] = [
  { a: "${param.x}", b: "Single request parameter (?x=)", c: "${param.q}" },
  { a: "${paramValues.x}", b: "All values of a multi-valued param", c: "${paramValues.tags[0]}" },
  { a: "${requestScope}", b: "Request-scoped attributes (the Model)", c: "${requestScope.user}" },
  { a: "${sessionScope}", b: "Session-scoped attributes", c: "${sessionScope.cart}" },
  { a: "${applicationScope}", b: "ServletContext attributes", c: "${applicationScope.version}" },
  { a: "${header}", b: "Request HTTP headers", c: "${header['User-Agent']}" },
  { a: "${cookie}", b: "Request cookies", c: "${cookie.JSESSIONID.value}" },
  { a: "${pageContext}", b: "PageContext (request/response/servlet)", c: "${pageContext.request.contextPath}" },
];

const JSTL_TAGS: RefRow[] = [
  { a: "<c:out>", b: "Print a value, HTML-escaped by default", c: "<c:out value=\"${slope.name}\"/>" },
  { a: "<c:set>", b: "Define / set a scoped variable", c: "<c:set var=\"n\" value=\"${fn:length(list)}\"/>" },
  { a: "<c:if>", b: "Single-branch conditional (no else)", c: "<c:if test=\"${not empty list}\">…</c:if>" },
  { a: "<c:choose>", b: "Multi-branch: when / otherwise", c: "<c:choose><c:when test=\"…\">…</c:when></c:choose>" },
  { a: "<c:forEach>", b: "Iterate a collection (items + var)", c: "<c:forEach var=\"s\" items=\"${slopes}\">" },
  { a: "<c:forTokens>", b: "Iterate over delimited tokens", c: "<c:forTokens items=\"a,b,c\" delims=\",\" var=\"t\">" },
  { a: "<c:url>", b: "Build a context-relative URL", c: "<c:url value=\"/rentals/${id}\"/>" },
  { a: "<c:redirect>", b: "Send an HTTP redirect", c: "<c:redirect url=\"/login\"/>" },
  { a: "<fmt:message>", b: "Resolve an i18n bundle key", c: "<fmt:message key=\"rental.title\"/>" },
  { a: "<fmt:formatNumber>", b: "Locale-aware number / currency", c: "<fmt:formatNumber value=\"${p}\" type=\"currency\"/>" },
  { a: "<fmt:formatDate>", b: "Format a date/time value", c: "<fmt:formatDate value=\"${d}\" pattern=\"dd/MM/yyyy\"/>" },
  { a: "fn:length / fn:contains", b: "JSTL functions (prefix fn)", c: "${fn:length(rentals)}" },
];

const ANNOTATIONS: RefRow[] = [
  { a: "@Controller", b: "Marks a web MVC controller (returns views)", c: "class RentalController { … }" },
  { a: "@RestController", b: "@Controller + @ResponseBody (JSON/body)", c: "returns serialized objects" },
  { a: "@RequestMapping", b: "Map URL/method to handler (class or method)", c: "@RequestMapping(\"/rentals\")" },
  { a: "@GetMapping / @PostMapping", b: "HTTP-verb shortcuts of @RequestMapping", c: "@GetMapping(\"/{id}\")" },
  { a: "@RequestParam", b: "Bind a query / form parameter", c: "@RequestParam(\"q\") String q" },
  { a: "@PathVariable", b: "Bind a {…} URI template segment", c: "@PathVariable long id" },
  { a: "@ModelAttribute", b: "Bind a command object / seed model data", c: "@ModelAttribute(\"form\") RegisterForm f" },
  { a: "@Valid + BindingResult", b: "Trigger JSR-303 validation + collect errors", c: "@Valid Form f, BindingResult err" },
  { a: "@ResponseBody", b: "Write the return value directly to the body", c: "@ResponseBody String ping()" },
  { a: "@ExceptionHandler", b: "Handle an exception type within a controller", c: "@ExceptionHandler(NotFound.class)" },
  { a: "@ControllerAdvice", b: "Cross-controller exception / model advice", c: "class GlobalHandler { … }" },
  { a: "@Service / @Repository", b: "Stereotypes for service & persistence beans", c: "@Service class RentalService" },
  { a: "@Autowired", b: "Dependency injection (prefer constructors)", c: "@Autowired RentalController(svc)" },
];

function RefTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: [string, string, string];
  rows: RefRow[];
}) {
  return (
    <SubPanel style={{ overflowX: "auto" }}>
      <div className="vtool-eyebrow" style={{ marginBottom: 10 }}>
        {caption}
      </div>
      <table className="vtool-table">
        <thead>
          <tr>
            <th style={{ width: "26%" }}>{headers[0]}</th>
            <th style={{ width: "38%" }}>{headers[1]}</th>
            <th>{headers[2]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.a + r.c}>
              <td>
                <code>{r.a}</code>
              </td>
              <td>{r.b}</td>
              <td>
                <code>{r.c}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SubPanel>
  );
}

function ReferenceTool() {
  const [tab, setTab] = useState<"el" | "jstl" | "ann">("el");

  return (
    <Panel>
      <div className="vtool-head">
        <h3>EL &amp; JSTL reference</h3>
        <p>
          Expression Language operators and implicit objects, the JSTL tag
          library, and a Spring MVC annotations quick-reference.
        </p>
      </div>

      <div className="vtool-row" role="group" aria-label="Reference section">
        <Chip active={tab === "el"} onClick={() => setTab("el")}>
          EL
        </Chip>
        <Chip active={tab === "jstl"} onClick={() => setTab("jstl")}>
          JSTL tags
        </Chip>
        <Chip active={tab === "ann"} onClick={() => setTab("ann")}>
          Annotations
        </Chip>
      </div>

      <div className="vtool-stack" style={{ marginTop: 18, gap: 18 }}>
        {tab === "el" && (
          <>
            <RefTable
              caption="EL operators"
              headers={["Operator", "Meaning", "Example"]}
              rows={EL_OPERATORS}
            />
            <RefTable
              caption="EL implicit objects"
              headers={["Object", "Resolves to", "Example"]}
              rows={EL_IMPLICIT}
            />
            <Note>
              EL is null-safe and silently yields empty for missing links, so{" "}
              <span className="vtool-mono">${"{a.b.c}"}</span> never throws an NPE in
              the view. Word forms (<span className="vtool-mono">eq</span>,{" "}
              <span className="vtool-mono">and</span>,{" "}
              <span className="vtool-mono">lt</span>) avoid having to escape{" "}
              <span className="vtool-mono">&lt;</span> /{" "}
              <span className="vtool-mono">&amp;</span> inside XML/JSP.
            </Note>
          </>
        )}

        {tab === "jstl" && (
          <>
            <RefTable
              caption="JSTL core / fmt / functions"
              headers={["Tag", "Meaning", "Example"]}
              rows={JSTL_TAGS}
            />
            <Note>
              Declare the taglibs at the top of the JSP:{" "}
              <span className="vtool-mono">prefix=&quot;c&quot;</span> →
              jstl/core,{" "}
              <span className="vtool-mono">prefix=&quot;fmt&quot;</span> →
              jstl/fmt,{" "}
              <span className="vtool-mono">prefix=&quot;fn&quot;</span> →
              jstl/functions. Prefer <span className="vtool-mono">&lt;c:out&gt;</span>{" "}
              over a bare <span className="vtool-mono">${"{…}"}</span> for
              user-supplied text to escape HTML and prevent XSS.
            </Note>
          </>
        )}

        {tab === "ann" && (
          <>
            <RefTable
              caption="Spring MVC annotations"
              headers={["Annotation", "Purpose", "Usage"]}
              rows={ANNOTATIONS}
            />
            <Note>
              <span className="vtool-mono">@RestController</span> equals{" "}
              <span className="vtool-mono">@Controller</span> +{" "}
              <span className="vtool-mono">@ResponseBody</span> on every method —
              use it for JSON APIs, plain{" "}
              <span className="vtool-mono">@Controller</span> for JSP views.
              Remember: <span className="vtool-mono">BindingResult</span> must
              immediately follow the{" "}
              <span className="vtool-mono">@Valid</span> parameter it reports on.
            </Note>
          </>
        )}
      </div>
    </Panel>
  );
}

/* =================================================================== *
 * Toolkit assembly
 * =================================================================== */

/* Runner poster (bespoke micro-illustration tinted by --k-color). */

/** Request → DispatcherServlet → Controller → view, and the response back. */
const PosterLifecycle = (
  <svg viewBox="0 0 288 150" fill="none">
    <path d="M34 40 H254" stroke="var(--k-color)" strokeWidth={2} strokeLinecap="round" />
    <path d="M246 34 L256 40 L246 46" stroke="var(--k-color)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M254 110 H34" stroke="var(--border)" strokeWidth={2} strokeLinecap="round" />
    <path d="M42 104 L32 110 L42 116" stroke="var(--border)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="24" y="58" width="60" height="34" rx="8" fill="color-mix(in srgb, var(--k-color) 12%, transparent)" stroke="var(--k-color)" strokeWidth={1.4} />
    <rect x="114" y="58" width="60" height="34" rx="8" fill="var(--surface-3)" stroke="var(--border)" strokeWidth={1.4} />
    <rect x="204" y="58" width="60" height="34" rx="8" fill="color-mix(in srgb, var(--k-color) 12%, transparent)" stroke="var(--k-color)" strokeWidth={1.4} />
    <path d="M84 75 H114 M174 75 H204" stroke="var(--border)" strokeWidth={1.4} />
    <text x="54" y="79" fill="var(--text-secondary)" fontSize={10} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }}>client</text>
    <text x="144" y="79" fill="var(--text-secondary)" fontSize={10} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }}>MVC</text>
    <text x="234" y="79" fill="var(--text-secondary)" fontSize={10} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }}>JSP</text>
    <text x="26" y="34" fill="var(--k-color)" fontSize={9} style={{ fontFamily: "var(--font-mono)" }}>request</text>
    <text x="214" y="130" fill="var(--text-secondary)" fontSize={9} style={{ fontFamily: "var(--font-mono)" }}>response</text>
  </svg>
);

const tools: Tool[] = [
  {
    key: "snippets",
    label: "Snippet cheatsheet",
    icon: "code",
    tone: "def",
    verb: "Copiar",
    desc: "Fragmentos de Spring MVC listos para copiar: controllers, validación, formularios y más, con un clic.",
    node: <SnippetTool />,
  },
  {
    key: "lifecycle",
    label: "Request lifecycle",
    icon: "cycle",
    tone: "def",
    verb: "Recorrer",
    desc: "Seguí una petición paso a paso, del navegador al servlet y de vuelta al JSP, para entender cómo viaja por Spring.",
    poster: PosterLifecycle,
    node: <LifecycleTool />,
  },
  {
    key: "reference",
    label: "EL & JSTL reference",
    icon: "braces",
    tone: "example",
    verb: "Consultar",
    desc: "Referencia rápida de Expression Language y etiquetas JSTL: la sintaxis que siempre se olvida, a mano.",
    node: <ReferenceTool />,
  },
];

export default function PawTools() {
  return (
    <ToolkitShell
      launcher={{
        code: "SYS.04",
        kicker: "Spring MVC · JSP",
        title: "Web Application Programming",
        accent: "var(--link)",
        pattern: "grid",
        variant: "flat",
        dek: "A reference bench for Spring MVC + JSP: copy-ready snippets from the Rent-The-Slopes stack, the request lifecycle end to end, and an EL / JSTL / annotations quick-reference.",
        meta: (
          <>
            <span className="tk__hero-metaitem">
              <b>3</b> tools
            </span>
            <span className="tk__hero-metaitem">Spring MVC + JSP</span>
            <span className="tk__hero-metaitem">/paw/herramientas</span>
          </>
        ),
        motif: (
          <svg viewBox="0 0 320 200" fill="none">
            <path d="M40 58 H282" stroke="var(--link)" strokeWidth={2} strokeLinecap="round" />
            <path d="M274 52 L284 58 L274 64" stroke="var(--link)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M280 142 H38" stroke="var(--border)" strokeWidth={2} strokeLinecap="round" />
            <path d="M46 136 L36 142 L46 148" stroke="var(--border)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <rect x="24" y="80" width="66" height="40" rx="8" fill="color-mix(in srgb, var(--link) 12%, transparent)" stroke="var(--link)" strokeWidth={1.4} />
            <rect x="127" y="80" width="66" height="40" rx="8" fill="var(--surface-3)" stroke="var(--border)" strokeWidth={1.4} />
            <rect x="230" y="80" width="66" height="40" rx="8" fill="color-mix(in srgb, var(--accent) 14%, transparent)" stroke="var(--accent)" strokeWidth={1.4} />
            <path d="M90 100 H127 M193 100 H230" stroke="var(--border)" strokeWidth={1.4} />
            <text x="57" y="104" fill="var(--text-secondary)" fontSize={10} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }}>
              client
            </text>
            <text x="160" y="104" fill="var(--text-secondary)" fontSize={10} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }}>
              MVC
            </text>
            <text x="263" y="104" fill="var(--text-secondary)" fontSize={10} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }}>
              JSP
            </text>
            <text x="26" y="72" fill="var(--text-secondary)" fontSize={9} style={{ fontFamily: "var(--font-mono)" }}>
              request
            </text>
            <text x="240" y="160" fill="var(--text-secondary)" fontSize={9} style={{ fontFamily: "var(--font-mono)" }}>
              response
            </text>
          </svg>
        ),
      }}
      tools={tools}
    />
  );
}
