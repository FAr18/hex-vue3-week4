import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.4/vue.esm-browser.min.js';
import pagination from './pagination.js';

let productModal = {}; //reference from example
let delProductModal = {};

const app = createApp({
  components: { pagination },
  data() {
    return {
      productList: [],
      tempProduct: {},
      isEditing: false,
      isRemoving: false,
      pagination: {}
    }
  },
  methods: {
    getProducts(page = 1) {
      axios.get(`${API_URL}api/${API_PATH}/admin/products?page=${page}`)
        .then((response) => {
          if (response.data.success) {
            this.productList = response.data.products;
            this.pagination = response.data.pagination;
          } else {
            window.location = 'index.html';
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createProduct() {
      this.isEditing = false;
      this.initTempProduct();
      productModal.show();
    },
    editProduct(product) {
      this.isEditing = true;
      this.tempProduct = {...product};
      productModal.show();
    },
    removeProduct(product) {
      this.tempProduct = {...product};
      delProductModal.show();
    },
    confirmRemove() {
      axios.delete(`${API_URL}api/${API_PATH}/admin/product/${this.tempProduct.id}`)
        .then((response) => {
          if (response.data.success) {
            this.getProducts(this.pagination.current_page);
            delProductModal.hide();
          } else {
            alert(response.data.message);
          }
        }).catch((error) => {
          console.log(error);
        });
    },
    confirmProduct() {
      let url = '';
      let http = '';
      if (this.isEditing) {
        url = `${API_URL}api/${API_PATH}/admin/product/${this.tempProduct.id}`;
        http = 'put';
      } else {
        url = `${API_URL}api/${API_PATH}/admin/product`;
        http = 'post';
      }
      axios[http](url, {
        data: this.tempProduct
      }).then((response) => {
        if (response.data.success) {
          this.getProducts(this.pagination.current_page);
          productModal.hide();
        } else {
          alert(response.data.message);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    initTempProduct() {
      this.tempProduct = {
        title: '',
        category: '',
        unit: '',
        origin_price: 0,
        price: 0,
        content: '',
        description: '',
        is_enabled: 1,
        imageUrl: '',
        imagesUrl: []
      }
    }
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.getProducts();
  }
});

app.component('productModal', {
  props: {
    tempProduct: Object,
    isEditing: Boolean,
  },
  data() {
    return {
      tempImageUrl: '',
    }
  },
  template: `
    <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
        aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 id="productModalLabel" class="modal-title">
              <span>{{ isEditing ? '????????????': '????????????'}}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="mb-1">
                  <div class="form-group">
                    <label for="imageUrl">??????????????????</label>
                    <input type="text" class="form-control"
                            placeholder="?????????????????????" v-model="tempProduct.imageUrl">
                  </div>
                  <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                </div>
                <div class="mb-1">
                  <div class="form-group">
                    <label for="imageUrl">??????????????????</label>
                    <input type="text" class="form-control"
                            placeholder="?????????????????????" v-model="tempImageUrl">
                  </div>
                  <img class="img-fluid" v-show="tempImageUrl.trim().length > 0" :src="tempImageUrl" alt="">
                  <button class="btn btn-outline-primary btn-sm d-block w-100" @click="addImage()">
                    ????????????
                  </button>
                </div>
                <div class="mb-1" v-for="(img, index) in tempProduct.imagesUrl" :key="index">
                  <img class="img-fluid" :src="img" alt="">
                  <button class="btn btn-outline-danger btn-sm d-block w-100" @click="removeImage(index)">
                    ????????????
                  </button>
                </div>
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">??????</label>
                  <input id="title" type="text" v-model="tempProduct.title" class="form-control" placeholder="???????????????">
                </div>

                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="category">??????</label>
                    <input id="category" type="text" class="form-control"
                            placeholder="???????????????" v-model="tempProduct.category">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">??????</label>
                    <input id="unit" type="text" class="form-control" placeholder="???????????????" v-model="tempProduct.unit">
                  </div>
                </div>

                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">??????</label>
                    <input id="origin_price" type="number" min="0" class="form-control" placeholder="???????????????" v-model.number="tempProduct.origin_price">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">??????</label>
                    <input id="price" type="number" min="0" class="form-control"
                            placeholder="???????????????" v-model.number="tempProduct.price">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">????????????</label>
                  <textarea id="description" type="text" class="form-control"
                            placeholder="?????????????????????" v-model="tempProduct.description">
                  </textarea>
                </div>
                <div class="form-group">
                  <label for="content">????????????</label>
                  <textarea id="description" type="text" class="form-control"
                            placeholder="?????????????????????" v-model="tempProduct.content">
                  </textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input id="is_enabled" class="form-check-input" type="checkbox"
                            :true-value="1" :false-value="0" v-model="tempProduct.is_enabled">
                    <label class="form-check-label" for="is_enabled">????????????</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              ??????
            </button>
            <button type="button" class="btn btn-primary" @click="$emit('confirm-product')">
              ??????
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    addImage() {
      this.tempProduct.imagesUrl.push(this.tempImageUrl);
      this.tempImageUrl = '';
    },
    removeImage(index) {
      this.tempProduct.imagesUrl.splice(index, 1);
    },
  },
});

app.component('delProductModal', {
  props: {
    tempProduct: Object
  },
  template: `
    <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
        aria-labelledby="delProductModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 id="delProductModalLabel" class="modal-title">
              <span>????????????</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ????????????
            <strong class="text-danger">{{ tempProduct.title }}</strong> ??????(????????????????????????)???
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              ??????
            </button>
            <button type="button" class="btn btn-danger" @click="$emit('confirm-remove')">
              ????????????
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
});

app.mount('#app');
