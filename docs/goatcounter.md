# GoatCounter — analytics e views dos posts

## Por que GoatCounter

O blog não tem banco de dados — é estático. Isso significa que o campo `post.views` no frontmatter só serve como placeholder manual. Para popular views de verdade, precisamos de um serviço externo que:

1. **Rastreie visitas** em cada página
2. **Exponha esses dados via API** para exibir no próprio site

GoatCounter resolve os dois pontos: é privacy-first (sem cookies, sem fingerprinting), tem um plano gratuito generoso, e oferece uma API pública simples para leitura de contagens.

---

## Como funciona

A integração tem **duas partes independentes**:

| Parte | O que faz | Onde vive |
|---|---|---|
| **Tracking** | Envia um hit para o GoatCounter a cada visita | `_layouts/default.html` |
| **Exibição** | Lê a contagem da API e popula o HTML | `views_controller.js` + `blog/index.html` |

As duas partes são desacopladas: o tracking funciona sem a exibição e vice-versa.

---

## Parte 1 — Tracking

### O script

```html
<script data-goatcounter="https://neylonsantos-blog.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

O script detecta automaticamente o path da página atual e envia um hit. Não requer configuração adicional.

### Onde adicionar

Em `_layouts/default.html`, antes do `</body>`, **dentro de um guard de produção**:

```html
  {% if jekyll.environment == "production" %}
  <script data-goatcounter="https://neylonsantos-blog.goatcounter.com/count"
          async src="//gc.zgo.at/count.js"></script>
  {% endif %}

  <script type="importmap">
  ...
```

### Por que o guard de produção

Sem ele, toda visita no `localhost:4000` durante o desenvolvimento seria contabilizada como real. O guard `jekyll.environment == "production"` só renderiza o script quando a variável de ambiente `JEKYLL_ENV=production` está definida — o que já acontece no CI (`deploy.yml` já tem `JEKYLL_ENV: production`).

---

## Parte 2 — Exibindo as views

### A API do GoatCounter

Para cada path, o GoatCounter expõe um endpoint público:

```
GET https://neylonsantos-blog.goatcounter.com/counter/PATH.json
```

O PATH é o caminho da URL do post, ex: `/2026/04/06/configurando-neovim/`

Resposta:
```json
{ "count": "42", "count_unique": "21" }
```

`count` = visitas totais, `count_unique` = visitantes únicos. Use `count` para exibir.

### O Stimulus controller

Criar `assets/js/controllers/views_controller.js`:

```js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = { path: String }

  async connect() {
    const endpoint = "https://neylonsantos-blog.goatcounter.com/counter";
    const url = `${endpoint}/${encodeURIComponent(this.pathValue)}.json`;

    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const { count } = await res.json();
      this.element.textContent = `* ${count} views`;
    } catch {
      // silencia erros de rede — fallback permanece no DOM
    }
  }
}
```

### Registrar em `assets/js/app.js`

```js
import ViewsController from "./controllers/views_controller.js";
application.register("views", ViewsController);
```

### Atualizar o post-card em `blog/index.html`

Trocar:

```html
<span class="post-card__views">* {{ post.views | default: 0 }} views</span>
```

Por:

```html
<span class="post-card__views"
      data-controller="views"
      data-views-path-value="{{ post.url }}">* — views</span>
```

O texto `* — views` é o fallback enquanto o fetch não completa (ou se falhar). O controller substitui pelo valor real no `connect()`.

O `post.url` do Jekyll já retorna o path correto, ex: `/2026/04/06/configurando-neovim/` — que é exatamente o que o GoatCounter rastreia.

---

## Checklist de implementação

- [ ] Adicionar o script de tracking em `_layouts/default.html` com guard de produção
- [ ] Criar `assets/js/controllers/views_controller.js`
- [ ] Registrar `ViewsController` em `assets/js/app.js`
- [ ] Atualizar o `<span>` de views em `blog/index.html`
- [ ] Testar localmente: views devem mostrar `* — views` (sem tracking)
- [ ] Após deploy: verificar no painel do GoatCounter se os hits aparecem

---

## Considerações

**CORS**: O endpoint `/counter/PATH.json` do GoatCounter suporta CORS — o fetch do browser funciona sem proxy.

**Rate limit**: A API pública é generosa para blogs pessoais. Sem paginação agressiva, não há risco de throttling.

**Campo `views` no frontmatter**: Pode ser removido dos posts futuros — não tem mais utilidade. Nos posts existentes (rascunhos com `_` no nome), é inofensivo.
