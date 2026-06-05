# Filtro de posts por modo (desativado)

O `filter_controller.js` existe mas está desconectado. Originalmente filtrava os posts exibidos conforme o tema ativo (dev ou humano).

Para reativar:

## 1. Registrar o controller em `assets/js/app.js`

```js
import FilterController from "./controllers/filter_controller.js";
application.register("filter", FilterController);
```

## 2. Reconectar o controller na listagem em `blog/index.html`

```html
<!-- no <p> do subtítulo, trocar o <span> simples por: -->
<span data-filter-target="count">{{ site.posts | size }}</span>

<!-- na div da listagem: -->
<div class="posts-list" data-controller="filter">

<!-- em cada post-card: -->
<div class="post-card"
     data-filter-target="post"
     data-post-mode="{{ post.mode | default: 'dev' }}">
```

## 3. Adicionar o campo `mode` no frontmatter dos posts

```yaml
mode: dev    # ou: human
```

O `theme_controller.js` já dispara o evento `theme:changed` — o `filter_controller` escuta esse evento e controla a visibilidade automaticamente.
