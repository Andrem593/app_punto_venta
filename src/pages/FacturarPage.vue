<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-sm-12 col-xs-12 col-md-8">
        <q-input
          v-model="searchProduct"
          class="text-h6"
          @change="getAllProducts"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-separator spaced />
        <q-btn-toggle
          v-model="secondModel"
          spread
          class="my-custom-toggle"
          no-caps
          unelevated
          toggle-color="primary"
          color="white"
          size="15px"
          text-color="primary"
          :options="[
            { label: 'CATEGORIAS', value: 'one' },
            { label: 'PRODUCTOS', value: 'two' },
          ]"
        />
        <q-separator spaced />

        <div style="max-height: 60vh" class="scroll">
          <div class="q-pa-md row justify-center q-gutter-md">
            <q-card
              style="width: 100px"
              class="my-card"
              flat
              bordered
              v-for="(data, index) in products"
              :key="index"
            >
              <q-img
                :src="data.img"
                class="my-img"
                style="width: 100px; height: 100px"
              />

              <q-card-section>
                <div class="row no-wrap items-center">
                  <div class="col ellipsis">{{ data.nombre }}</div>
                </div>
                <div class="row justify-center">
                  <q-btn
                    :disable="form.cliente_id == ''"
                    flat
                    style="font-size: 10px"
                    color="primary"
                    @click="getProductInformation(data)"
                  >
                    Agregar
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-separator spaced />
      </div>
      <div class="col-sm-12 col-xs-12 col-md-4">
        <div class="q-pa-md">
          <div class="justify-center">
            <q-card class="my-card" flat bordered>
              <q-card-section class="row items-center">
                <div class="col text-center">
                  <div style="font-size: 18px">{{ form.nombre_completo }}</div>
                  <div class="text-subtitle2">{{ form.cedula }}</div>
                </div>
                <div class="col-auto">
                  <q-btn
                    @click="modalSearchClient = true"
                    color="secondary"
                    icon="search"
                    icon-right="person"
                  />
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="text-subtitle2">Saldo: ${{ form.saldo }}</div>
              </q-card-section>

              <!-- <q-separator /> -->
              <!-- <q-card-section>
                <q-table
                  style="height: 400px"
                  flat
                  bordered
                  virtual-scroll
                  title="Treats"
                  :rows="rows"
                  :columns="columns"
                  :rows-per-page-options="[0]"
                  row-key="name"
                />
              </q-card-section> -->

              <!-- <q-separator /> -->

              <!-- <div style="max-height: 30vh" class="scroll">
                <q-card-actions class="q-pa-sm">
                  <div
                    class="row items-center"
                    style="width: 100%"
                    v-for="i in 15"
                    :key="i"
                  >
                    <q-item-label class="col text-start"
                      >Calzado: {{ i }}</q-item-label
                    >
                    <div class="col-auto row justify-end">
                      <q-item-label class="col text-start"
                        >${{ i }}.00</q-item-label
                      >
                    </div>
                  </div>
                </q-card-actions>
              </div> -->

              <q-card-section class="q-pa-sm">
                <div style="width: 100%; height: 300px; overflow: auto">
                  <q-table
                    flat
                    bordered
                    :rows="form.productos"
                    :columns="columns1"
                    row-key="id"
                    virtual-scroll
                    v-model:pagination="pagination"
                    :rows-per-page-options="[]"
                    hide-bottom
                    class="custom-table"
                  >
                    <template v-slot:body-cell-precio="props">
                      <q-td :props="props">
                        ${{ props.row.precio }}
                        <!-- <q-input v-model="props.row.nombre" dense /> -->
                      </q-td>
                    </template>
                    <template v-slot:body-cell-total="props">
                      <q-td :props="props">
                        ${{ props.row.total }}
                        <!-- <q-input v-model="props.row.nombre" dense /> -->
                      </q-td>
                    </template>

                    <!-- <template v-slot:body-cell-cantidad="props">
                      <q-td :props="props">
                        <q-input
                          v-model="props.row.cantidad"
                          type="number"
                          dense
                        />
                      </q-td>
                    </template> -->

                    <!-- <template v-slot:body-cell-precio="props">
                      <q-td :props="props">
                        <q-input v-model="props.row.precio" type="number" dense />
                      </q-td>
                    </template> -->

                    <template v-slot:body-cell-acciones="props">
                      <q-td :props="props">
                        <q-btn
                          color="negative"
                          icon="delete"
                          @click="deleteProduct(props.row, props.rowIndex)"
                          dense
                        />
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </q-card-section>
              <!-- <q-separator /> -->
              <!-- <q-card-actions class="q-pa-sm">
                <div class="row items-center" style="width: 100%">
                  <q-item-label class="col text-start">Descuento:</q-item-label>
                  <div class="col-auto row justify-end">
                    <q-item-label class="col text-start"
                      >${{ form.descuento }}</q-item-label
                    >
                  </div>
                </div>
              </q-card-actions> -->
              <!-- <q-separator /> -->

              <!-- <q-card-actions class="q-pa-sm">
                <div class="row items-center" style="width: 100%">
                  <q-item-label class="col text-start"
                    >Subtotal I.V.A:</q-item-label
                  >
                  <div class="col-auto row justify-end">
                    <q-item-label class="col text-start"
                      >${{ form.subtotal_iva }}</q-item-label
                    >
                  </div>
                </div>
              </q-card-actions> -->
              <q-card-actions class="q-pa-sm">
                <div class="row items-center" style="width: 100%">
                  <q-item-label class="col text-start">Subtotal:</q-item-label>
                  <div class="col-auto row justify-end">
                    <q-item-label class="col text-start"
                      >${{ form.subtotal }}</q-item-label
                    >
                  </div>
                </div>
              </q-card-actions>
              <q-card-actions class="q-pa-sm">
                <div class="row items-center" style="width: 100%">
                  <q-item-label class="col text-start">IVA:</q-item-label>
                  <div class="col-auto row justify-end">
                    <q-item-label class="col text-start"
                      >${{ form.iva }}</q-item-label
                    >
                  </div>
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <div class="q-mt-md q-mx-md q-pa-md" style="background: #1976d2">
          <div class="row items-center" style="width: 100%">
            <q-item-label class="col text-start" style="color: white"
              ><strong>TOTAL</strong></q-item-label
            >
            <div class="col-auto row justify-end">
              <q-item-label class="col text-start" style="color: white"
                ><strong>${{ form.total }}</strong></q-item-label
              >
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-12">
        <q-btn-group spread>
          <q-btn
            style="background-color: #00cfff; color: white; font-size: 20px"
            label="GUARDAR"
            @click="save"
            icon="save"
          />
          <q-btn
            color="green"
            label="PAGAR"
            style="font-size: 20px"
            icon="money"
          />
        </q-btn-group>
      </div>
    </div>

    <q-dialog v-model="modalSearchClient">
      <q-card style="width: 700px; max-width: 80vw">
        <q-toolbar>
          <q-avatar>
            <img
              src="https://contifico.com/wp-content/uploads/2020/06/isotipo-contifico-1.png"
            />
          </q-avatar>

          <q-toolbar-title class="text-center"
            >Listado de Personas</q-toolbar-title
          >

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-input v-model="name" label="Cliente" lazy-rules
            ><template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-list bordered class="rounded-borders">
            <q-item clickable v-ripple v-for="(data, i) in clientes" :key="i">
              <q-item-section @click="getCustomerData(data)">
                <q-item-label lines="1">{{
                  data.nombre_completo
                }}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{ data.cedula }}</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side top>{{ data.correo }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="cardFlag">
      <q-card class="my-card">
        <q-img :src="product.img" />
        <q-card-section>
          <div class="row items-center">
            <div class="col text-h6 ellipsis text-bold">
              {{ product.nombre }}
            </div>
          </div>
          <div class="row items-center q-mt-sm">
            <div class="col text-subtitle2 ellipsis">
              Precio: ${{ product.precio }}
            </div>
            <div class="col text-subtitle2 ellipsis">
              Stock: {{ product.stock }}
            </div>
          </div>
          <q-input
            type="number"
            v-model="product.cantidad"
            label="Cantidad"
            outlined
            class="q-mt-sm"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            color="primary"
            @click="addProducts(product)"
            label="Añadir"
          />
          <q-btn v-close-popup flat color="primary" label="Cancelar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: "facturarPage",
  data() {
    return {
      model: "one",
      secondModel: "one",
      modalSearchClient: false,
      alert: false,
      cardFlag: false,
      product: {
        id: "",
        nombre: "",
        stock: 0,
        img: "",
        cantidad: 1,
        precio: 0,
      },
      products: [],
      clientes: [
        {
          id: 1,
          nombre_completo: "MARCO ANTONIO CARDENAS PEREZ",
          cedula: "0944296730",
          correo: "1",
          saldo: 1000,
        },
        {
          id: 2,
          nombre_completo: "JUAN ALEXANDER PEREZ GUAMAN",
          cedula: "0944289545",
          correo: "saddsdas",
          saldo: 1000,
        },
        {
          id: 3,
          nombre_completo: "JOSE BOLIVAR CARDENAS PEREZ",
          cedula: "0944289545",
          correo: "sadasds",
          saldo: 1000,
        },
        {
          id: 4,
          nombre_completo: "ROSA AMELIA PEREZ GUAMAN",
          cedula: "0944289545",
          correo: "asdddsa",
          saldo: 50,
        },
        {
          id: 5,
          nombre_completo: "PRUEBA PREUEBA ",
          cedula: "0944289545",
          correo: "daads",
          saldo: 1000,
        },
        {
          id: 6,
          nombre_completo: "BRANDY ALEXANDER",
          cedula: "0944289545",
          correo: "dadasdas",
          saldo: 80,
        },
      ],
      columns: [
        {
          name: "name",
          required: true,
          label: "Dessert (1000g serving)",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          field: "calories",
          sortable: true,
        },
        { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
      ],

      rows: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%",
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%",
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%",
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%",
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%",
        },
      ],
      form: {
        cliente_id: "",
        nombre_completo: "",
        cedula: "",
        saldo: 0.0,
        saldo_actual: 0.0,
        productos: [],
        descuento: 0.0,
        subtotal_iva: 0.0,
        subtotal: 0.0,
        total: 0.0,
        iva: 0.0,
      },
      searchProduct: "",
      pagination: {
        rowsPerPage: 0,
      },
      productos1: [{ id: 1, nombre: "", cantidad: 1, precio: 0 }],
      columns1: [
        {
          name: "nombre",
          label: "Nombre",
          align: "left",
          field: "nombre",
        },
        {
          name: "cantidad",
          label: "Cant.",
          align: "right",
          field: "cantidad",
        },
        {
          name: "precio",
          label: "Precio",
          align: "right",
          field: "precio",
        },
        { name: "total", label: "Total", align: "right", field: "total" },
        { name: "acciones", label: "", align: "right" },
      ],
    };
  },
  watch: {
    searchProduct(value) {
      let self = this;
      self.getAllProducts(value);
    },
  },
  methods: {
    getAllProducts(value) {
      let self = this;
      if (value != "") {
        console.log("Buscar Productos: ", value);
      }
    },
    getProductInformation(data) {
      console.log(data);
      let self = this;
      self.cardFlag = true;
      self.product = { cantidad: 1, ...data };
    },
    getCustomerData(data) {
      let self = this;
      self.form.cliente_id = data.id;
      self.form.nombre_completo = data.nombre_completo;
      self.form.cedula = data.cedula;
      self.form.saldo = data.saldo;
      self.form.saldo_actual = data.saldo;

      self.form.productos = [];
      self.form.descuento = 0.0;
      self.form.subtotal_iva = 0.0;
      self.form.subtotal = 0.0;
      self.form.total = 0.0;
      self.form.iva = 0.0;

      self.modalSearchClient = false;
      console.log(data);
    },
    triggerPositive(message) {
      this.$q.notify({
        type: "positive",
        message: message,
      });
    },
    triggerNegative(message) {
      this.$q.notify({
        type: "negative",
        message: message,
      });
    },
    addProducts(data) {
      let self = this;
      let total = self.form.productos.reduce(
        (acc, producto) => acc + producto.total,
        0
      );

      total += parseFloat(data.cantidad) * data.precio;

      if (total > self.form.saldo_actual) {
        self.triggerNegative("No tiene suficiente saldo");
        console.log("No tiene mas saldo");
        return;
      }

      let existingProduct = self.form.productos.find(
        (producto) => producto.id === data.id
      );

      if (existingProduct) {
        // Si el producto ya existe, actualizar cantidad y total
        existingProduct.cantidad =
          parseFloat(existingProduct.cantidad) + parseFloat(data.cantidad); // Sumar la nueva cantidad
        existingProduct.total =
          existingProduct.cantidad * existingProduct.precio; // Recalcular el total
      } else {
        // Si el producto no existe, agregarlo a la lista
        self.form.productos.push({
          id: data.id,
          nombre: data.nombre,
          img: data.img,
          cantidad: data.cantidad,
          precio: data.precio,
          total: data.cantidad * data.precio,
        });
      }

      self.form.total = self.form.productos.reduce(
        (acc, producto) => acc + producto.total,
        0
      );

      self.form.saldo = self.form.saldo_actual - self.form.total;

      self.product = {
        id: "",
        nombre: "",
        stock: 0,
        img: "",
        cantidad: 1,
        precio: 0,
      };
      self.cardFlag = false;
    },
    deleteProduct(data, indice) {
      let self = this;

      //Ver si se devuelve al stock
      self.form.productos.splice(indice, 1);
    },
    save() {
      let self = this;
      console.log(self.form);
      if (self.form.id != "" && self.form.productos.length > 0) {
        self.triggerPositive("Guardado");
      } else {
        self.triggerNegative("Debe tener añadido por lo mínimo un producto");
      }
    },
  },
  created() {
    for (let index = 0; index < 22; index++) {
      this.products.push({
        id: index,
        img: "https://cdn.quasar.dev/img/chicken-salad.jpg",
        nombre: `Prueba ${index}`,
        stock: 20,
        precio: 30,
      });
    }
  },
  mounted() {},
};
</script>

<style scoped>
.custom-font p {
  font-size: 16px; /* Ajusta el tamaño de letra según tus necesidades */
  white-space: normal; /* Permite que el texto se ajuste automáticamente */
  overflow: hidden; /* Oculta el exceso de texto */
  text-overflow: ellipsis; /* Agrega puntos suspensivos al final del texto que se desborda */
}
.my-img {
  width: 100%; /* Tamaño completo de la imagen dentro de la tarjeta */
  height: 120px; /* Altura específica para la imagen (ajustar según necesidades) */
  object-fit: cover; /* Ajuste para cubrir completamente el espacio asignado */
}
.my-card-2 {
  width: 200;
  max-width: calc(100% / 6 - 20px); /* Ancho máximo de cada tarjeta */
  margin: 10px; /* Margen entre tarjetas */
}

@media (max-width: 1560px) {
  .my-card-2 {
    max-width: calc(
      100% / 4 - 20px
    ); /* Reducir el ancho máximo para pantallas más pequeñas */
  }
}

@media (max-width: 960px) {
  .my-card-2 {
    max-width: calc(
      100% / 2 - 20px
    ); /* Reducir el ancho máximo para pantallas más pequeñas */
  }
}

@media (max-width: 600px) {
  .my-card-2 {
    max-width: calc(
      100% / 1 - 20px
    ); /* Aún más reducido para pantallas muy pequeñas */
  }
}

.custom-table .q-table__middle,
.custom-table .q-table__container {
  height: 100%;
}

.custom-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--q-table-header-background-color, white);
}
</style>
