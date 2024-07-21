<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-sm-12 col-xs-12 col-md-8">
        <q-btn color="black" label="Pedidos Guardados" @click="openSave" />
        <q-separator spaced />
        <q-input v-model="searchProduct" class="text-h6">
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
                v-if="data.img && data.img != ''"
                :src="data.img"
                class="my-img"
                style="width: 100px; height: 100px"
              />
              <q-img
                v-else
                src="src/assets/images/no-image.png"
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
            @click="saveSale"
            color="green"
            label="PAGAR"
            style="font-size: 20px"
            icon="money"
          />
        </q-btn-group>
      </div>
    </div>

    <q-dialog v-model="modalGuardadoClient">
      <q-card style="width: 700px; max-width: 80vw">
        <q-toolbar>
          <q-avatar>
            <img
              src="https://contifico.com/wp-content/uploads/2020/06/isotipo-contifico-1.png"
            />
          </q-avatar>

          <q-toolbar-title class="text-center"
            >Listado de Pedidos Guardados</q-toolbar-title
          >

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="q-pa-sm">
          <div style="width: 100%; height: 300px; overflow: auto">
            <q-table
              flat
              bordered
              :rows="pedidos_guardados"
              :columns="pedidos_guardados_cabecera"
              row-key="id"
              virtual-scroll
              v-model:pagination="pagination"
              :rows-per-page-options="[]"
              hide-bottom
              class="custom-table"
            >
              <template v-slot:body-cell-precio="props">
                <q-td :props="props"> ${{ props.row.precio }} </q-td>
              </template>
              <template v-slot:body-cell-total="props">
                <q-td :props="props"> ${{ props.row.total }} </q-td>
              </template>
              <template v-slot:body-cell-acciones="props">
                <q-td :props="props">
                  <q-btn
                    color="primary"
                    icon="restore"
                    @click="recoverOrder(props.row, props.rowIndex)"
                    dense
                  />
                  <q-btn
                    color="negative"
                    icon="delete"
                    @click="deleteOrder(props.row, props.rowIndex)"
                    dense
                  />
                </q-td>
              </template>
            </q-table>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

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
          <q-input v-model="searchClient" label="Cliente"
            ><template v-slot:prepend>
              <q-icon name="searchss" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-list bordered class="rounded-borders">
            <q-item clickable v-ripple v-for="(data, i) in clientes" :key="i">
              <q-item-section @click="getCustomerData(data)">
                <q-item-label lines="1">{{ data.nombres }}</q-item-label>
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
        <q-img v-if="product.img && product.img != ''" :src="product.img" />
        <q-img v-else src="src/assets/images/no-image.png" />
        <q-card-section>
          <div class="row items-center">
            <div class="col text-h6 ellipsis text-bold">
              {{ product.nombre }}
            </div>
          </div>
          <div class="row items-center q-mt-sm">
            <div class="col text-subtitle2 ellipsis">${{ product.precio }}</div>
            <div class="col text-subtitle2 ellipsis">
              Stock: {{ product.stock }}
            </div>
          </div>
          <q-input
            type="number"
            v-model="product.cantidad"
            :max="product.stock"
            :min="1"
            label="Cantidad"
            outlined
            class="q-mt-sm"
            lazy-rules
            :rules="[
              (val) =>
                (val > 0 && val <= product.stock) ||
                'La cantidad debe estar dentro del rango',
            ]"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
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
      modalGuardadoClient: false,
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
        /*{
          id: 1,
          nombre_completo: "MARCO ANTONIO CARDENAS PEREZ",
          cedula: "0944296730",
          correo: "1",
          saldo: 1000,
        },*/
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
        id: "",
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
      searchClient: "",
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
      pedidos_guardados_cabecera: [
        {
          name: "nombres",
          label: "Cliente",
          align: "left",
          field: "nombres",
        },
        {
          name: "fecha",
          label: "Fecha",
          align: "left",
          field: "fecha",
        },
        {
          name: "saldo",
          label: "Saldo",
          align: "right",
          field: "saldo",
        },
        {
          name: "total",
          label: "$ Total",
          align: "right",
          field: "total",
        },
        { name: "acciones", label: "", align: "right" },
      ],
      pedidos_guardados: [
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
        // {
        //   id: 1,
        //   nombres: "MARCO ",
        //   saldo: 10,
        //   total: 20,
        // },
      ],
    };
  },
  watch: {
    searchProduct(value) {
      let self = this;
      self.getProducts(value);
    },
    searchClient(value) {
      console.log(value);
      let self = this;
      self.getClients(value);
    },
  },
  methods: {
    recoverOrder(data, indice) {
      let self = this;
      self.form = { ...data };
      self.modalGuardadoClient = false;
      self.triggerPositive("Pedido Recuperado");
    },
    deleteOrder(data, indice) {
      let self = this;
      this.$axios
        .delete(`api/pedidos-encabezados/${data.id}`)
        .then(({ data }) => {
          self.pedidos_guardados.splice(indice, 1);
          self.triggerPositive("Pedido Eliminado");
        })
        .catch((error) => {
          self.triggerNegative(error);
        });
    },
    getSavedOrders() {
      let self = this;
      this.$axios
        .get(`api/pedidos-encabezados`)
        .then(({ data }) => {
          self.pedidos_guardados = data;
        })
        .catch((error) => {
          self.triggerNegative(error);
        });
    },
    getProducts(nombre = null) {
      let self = this;
      let filtro = "";
      if (nombre != null && nombre.length > 2) {
        filtro = `&nombre=${nombre}`;
      }
      this.$axios
        .get(`api/productos?perPage=all${filtro}`)
        .then(({ data }) => {
          self.products = data;
        })
        .catch(({ error }) => {
          self.triggerNegative(error);
        });
    },
    openSave() {
      let self = this;
      self.modalGuardadoClient = true;
      self.clearForm();
    },
    getClients(nombres = null) {
      let self = this;
      let filtro = "";
      if (nombres != null && nombres.length > 2) {
        filtro = `&nombres=${nombres}`;
      }
      this.$axios
        .get(`api/clientes?perPage=all${filtro}`)
        .then(({ data }) => {
          self.clientes = data;
        })
        .catch((error) => {
          self.triggerNegative(error.error);
        });
    },
    getAllProducts(value) {
      let self = this;
      if (value != "") {
        console.log("Buscar Productos: ", value);
      }
    },
    getProductInformation(data) {
      let self = this;
      this.$axios
        .get(`api/producto/${data.id}`)
        .then(({ data }) => {
          self.product = { cantidad: 1, ...data };
          self.cardFlag = true;
        })
        .catch((error) => {
          self.triggerNegative(error.error);
        });
    },
    getCustomerData(data) {
      let self = this;
      self.form.cliente_id = data.id;
      self.form.nombre_completo = data.nombres;
      self.form.cedula = data.cedula;
      self.form.saldo = data.valor;
      self.form.saldo_actual = data.valor;

      //Aqui devolver al stock

      if (self.form.productos.length > 0) {
        this.$axios
          .post(`api/devolver-cantidad-productos`, {
            productos: self.form.productos,
          })
          .then(({ data }) => {
            self.form.productos = [];
            self.form.descuento = 0.0;
            self.form.subtotal_iva = 0.0;
            self.form.subtotal = 0.0;
            self.form.total = 0.0;
            self.form.iva = 0.0;

            self.modalSearchClient = false;
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              self.triggerNegative(`${error.response.data.message}`);
            } else {
              self.triggerNegative("Ocurrió un error inesperado.");
            }
          });
      } else {
        self.form.productos = [];
        self.form.descuento = 0.0;
        self.form.subtotal_iva = 0.0;
        self.form.subtotal = 0.0;
        self.form.total = 0.0;
        self.form.iva = 0.0;

        self.modalSearchClient = false;
      }
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

      //Validacion del Stock, ver si despues e descuenta al instante y ahi tendria
      // que manejar otra logica
      // let existingProductCant = self.form.productos.find(
      //   (producto) => producto.producto_id === data.id
      // );

      // if (existingProductCant) {
      //   let sumCantidad =
      //     parseInt(existingProductCant.cantidad) + parseInt(data.cantidad);
      //   if (sumCantidad > parseInt(data.stock)) {
      //     self.triggerNegative(
      //       "La cantidad total debe ser menor o igual al Stock"
      //     );
      //     return;
      //   }
      // }

      // parseInt(data.cantidad) > 0 &&
      if (parseInt(data.cantidad) == 0) {
        self.triggerNegative("La cantidad debe ser mayor a 1");
        return;
      }
      if (parseInt(data.cantidad) > parseInt(data.stock)) {
        self.triggerNegative("La cantidad debe ser menor o igual al Stock");
        return;
      }

      let total = self.form.productos.reduce(
        (acc, producto) => acc + producto.total,
        0
      );

      total += parseFloat(data.cantidad) * data.precio;

      if (total > self.form.saldo_actual) {
        self.triggerNegative("No tiene suficiente saldo");
        return;
      }

      this.$axios
        .get(`api/cambio-stock-producto/${data.id}/${data.cantidad}/1`)
        .then((response) => {
          let existingProduct = self.form.productos.find(
            (producto) => producto.producto_id === data.id
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
              producto_id: data.id,
              nombre: data.nombre,
              img: data.img,
              cantidad: data.cantidad,
              precio: data.precio,
              total: parseFloat(data.cantidad) * parseFloat(data.precio),
            });
          }

          self.form.total = self.form.productos.reduce(
            (acc, producto) => acc + producto.total,
            0
          );

          self.form.total = self.form.total.toFixed(2);

          self.form.saldo =
            parseFloat(self.form.saldo_actual) - parseFloat(self.form.total);

          self.form.saldo = self.form.saldo.toFixed(2);

          self.product = {
            id: "",
            nombre: "",
            stock: 0,
            img: "",
            cantidad: 1,
            precio: 0,
          };
          self.cardFlag = false;
        })
        .catch(() => {
          self.triggerNegative("Ha ocurrido un error al agregar el producto");
        });
    },
    deleteProduct(data, indice) {
      let self = this;

      this.$axios
        .get(`api/cambio-stock-producto/${data.producto_id}/${data.cantidad}/2`)
        .then((response) => {
          self.form.productos.splice(indice, 1);

          self.form.total = self.form.productos.reduce(
            (acc, producto) => acc + producto.total,
            0
          );

          self.form.total = self.form.total.toFixed(2);

          self.form.saldo =
            parseFloat(self.form.saldo_actual) - parseFloat(self.form.total);
          self.form.saldo = self.form.saldo.toFixed(2);
        })
        .catch(() => {
          self.triggerNegative("Ha ocurrido un error al eliminar");
        });
    },
    clearForm() {
      let self = this;
      self.form = {
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
      };
    },
    saveSale() {
      let self = this;
      this.$axios
        .post(`api/venta-encabezados`, { ...self.form })
        .then(({ data }) => {
          self.getClients();
          self.getProducts();
          self.getSavedOrders();
          self.triggerPositive("Venta Guardada");
          self.clearForm();
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            //Devuelvo todos los productos
            if (error.response.status === 409) {
              self.$axios
                .post(`api/devolver-cantidad-productos`, {
                  productos: self.form.productos,
                })
                .then(({ data }) => {
                  self.form.productos = [];
                  self.form.descuento = 0.0;
                  self.form.subtotal_iva = 0.0;
                  self.form.subtotal = 0.0;
                  self.form.total = 0.0;
                  self.form.iva = 0.0;

                  self.modalSearchClient = false;
                })
                .catch((error) => {
                  if (error.response && error.response.data) {
                    self.triggerNegative(`${error.response.data.message}`);
                  } else {
                    self.triggerNegative("Ocurrió un error inesperado.");
                  }
                });
              self.triggerNegative(`${error.response.data.message}`);
            }
          } else {
            self.triggerNegative("Ocurrió un error inesperado.");
          }
        });
    },
    save() {
      let self = this;
      if (self.form.productos.length > 0) {
        if (self.form.id) {
          //Verificar
          this.$axios
            .put(`api/pedidos-encabezados/${self.form.id}`, { ...self.form })
            .then(({ data }) => {
              self.getClients();
              self.getProducts();
              self.getSavedOrders();
              self.triggerPositive("Guardado");
              self.clearForm();
            })
            .catch((error) => {
              if (error.response && error.response.data) {
                //Devuelvo todos los productos
                if (error.response.status === 409) {
                  self.$axios
                    .post(`api/devolver-cantidad-productos`, {
                      productos: self.form.productos,
                    })
                    .then(({ data }) => {
                      self.form.productos = [];
                      self.form.descuento = 0.0;
                      self.form.subtotal_iva = 0.0;
                      self.form.subtotal = 0.0;
                      self.form.total = 0.0;
                      self.form.iva = 0.0;

                      self.modalSearchClient = false;
                    })
                    .catch((error) => {
                      if (error.response && error.response.data) {
                        self.triggerNegative(`${error.response.data.message}`);
                      } else {
                        self.triggerNegative("Ocurrió un error inesperado.");
                      }
                    });
                  self.triggerNegative(`${error.response.data.message}`);
                }
              } else {
                self.triggerNegative("Ocurrió un error inesperado.");
              }
            });
        } else {
          this.$axios
            .post(`api/pedidos-encabezados`, { ...self.form })
            .then(({ data }) => {
              self.getClients();
              self.getProducts();
              self.getSavedOrders();
              self.triggerPositive("Guardado");
              self.clearForm();
            })
            .catch((error) => {
              if (error.response && error.response.data) {
                //Devuelvo todos los productos
                if (error.response.status === 409) {
                  self.$axios
                    .post(`api/devolver-cantidad-productos`, {
                      productos: self.form.productos,
                    })
                    .then(({ data }) => {
                      self.form.productos = [];
                      self.form.descuento = 0.0;
                      self.form.subtotal_iva = 0.0;
                      self.form.subtotal = 0.0;
                      self.form.total = 0.0;
                      self.form.iva = 0.0;

                      self.modalSearchClient = false;
                    })
                    .catch((error) => {
                      if (error.response && error.response.data) {
                        self.triggerNegative(`${error.response.data.message}`);
                      } else {
                        self.triggerNegative("Ocurrió un error inesperado.");
                      }
                    });
                  self.triggerNegative(`${error.response.data.message}`);
                }
              } else {
                self.triggerNegative("Ocurrió un error inesperado.");
              }
            });
        }
      } else {
        self.triggerNegative("Debe tener añadido por lo mínimo un producto");
      }
    },
  },
  created() {
    this.getClients();
    this.getProducts();
    this.getSavedOrders();
    // for (let index = 0; index < 22; index++) {
    //   this.products.push({
    //     id: index,
    //     img: "https://cdn.quasar.dev/img/chicken-salad.jpg",
    //     nombre: `Prueba ${index}`,
    //     stock: 20,
    //     precio: 30,
    //   });
    // }
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
