export default {
  props: {
    page: Object
  },
  template: `
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled': !page.has_pre}">
        <a class="page-link" href="#" aria-label="Previous" @click="$emit('get-products', page.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" :class="{'active': page_index == page.current_page}" v-for="page_index in page.total_pages" :key="page_index">
        <a class="page-link" href="#" @click="$emit('get-products', page_index)">{{ page_index }}</a>
      </li>
      <li class="page-item" :class="{'disabled': !page.has_next}">
        <a class="page-link" href="#" aria-label="Next" @click="$emit('get-products', page.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
  `
}
