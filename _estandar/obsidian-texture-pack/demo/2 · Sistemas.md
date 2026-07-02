---
cssclasses:
  - sv-sistemas
---
###### PAW · Spring MVC

# Ciclo de vida de un request

#servlet #controller

El `DispatcherServlet` es el front controller: recibe cada request, resuelve el
handler y delega el render de la vista.

## Flujo

> [!note] nota
> El mapping **@RequestMapping** se resuelve una sola vez al arranque y se
> cachea en el `HandlerMapping`.

```java
// resolver → invocar → responder
@GetMapping("/curso/{id}")
public ModelAndView show(@PathVariable long id) {
  return new ModelAndView("curso", "c", service.byId(id));
}
```

Si ningún handler matchea, el servlet responde **404**.

## Componentes

| etapa | componente |
|-------|------------|
| resolver | HandlerMapping |
| invocar | HandlerAdapter |
| render | ViewResolver |
