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

              <q-card-section class="no-padding-no-margin">
                <div class="row items-center" style="height: 100%">
                  <div
                    class="col text-center text-bold"
                    style="font-size: 10px"
                  >
                    {{ data.nombre }}
                  </div>
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
                    @click="openModalClients"
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
            :disable="isDisabled"
            @click="save"
            icon="save"
          />
          <q-btn
            @click="saveSale"
            :disable="isDisabled"
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
      <q-card class="my-card" style="width: 250px">
        <q-img v-if="product.img && product.img != ''" :src="product.img" />
        <q-img v-else src="src/assets/images/no-image.png" />
        <q-card-section>
          <div class="row items-center">
            <div class="col text-h6 text-center text-bold">
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
const { ipcRenderer } = require("electron");
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
      clientes: [],
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

      rows: [],
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
      pedidos_guardados_cabecera: [],
      pedidos_guardados: [],
      isDisabled: false,
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
    databaseLocalGetProducts(nombre = null) {
      let self = this;
      ipcRenderer
        .invoke("get-products", nombre)
        .then((data) => {
          self.products = data;
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
      let online = navigator.onLine;
      //CAMBIAR
      if (!online) {
        this.$axios
          .get(`api/productos?perPage=all${filtro}`)
          .then(({ data }) => {
            self.products = data;
          })
          .catch(({ error }) => {
            self.triggerNegative(error);
          });
      } else {
        self.databaseLocalGetProducts(nombre);
      }
    },
    openSave() {
      let self = this;
      self.modalGuardadoClient = true;
      self.clearForm();
      self.getSavedOrders();
    },
    dataBaseLocalgetClients(nombres) {
      let self = this;
      ipcRenderer
        .invoke("get-customers", nombres)
        .then((data) => {
          self.clientes = data;
        })
        .catch((error) => {
          self.triggerNegative(error);
        });
    },
    getClients(nombres = null) {
      let self = this;
      let filtro = "";
      if (nombres != null && nombres.length > 2) {
        filtro = `&nombres=${nombres}`;
      }

      let online = navigator.onLine;
      //CAMBIAR
      if (!online) {
        this.$axios
          .get(`api/clientes?perPage=all${filtro}`)
          .then(({ data }) => {
            self.clientes = data;
          })
          .catch((error) => {
            self.triggerNegative(error.error);
          });
      } else {
        self.dataBaseLocalgetClients(nombres);
      }
    },
    getAllProducts(value) {
      let self = this;
      if (value != "") {
        console.log("Buscar Productos: ", value);
      }
    },
    databaseGetProductInformation(data) {
      let self = this;
      ipcRenderer
        .invoke("producto", data.id)
        .then((data) => {
          console.log(data, "invoke");
          self.product = { cantidad: 1, ...data };
          self.cardFlag = true;
        })
        .catch((error) => {
          self.triggerNegative(error);
        });
    },
    getProductInformation(data) {
      let self = this;
      let online = navigator.onLine;
      //CAMBIAR
      if (!online) {
        this.$axios
          .get(`api/producto/${data.id}`)
          .then(({ data }) => {
            self.product = { cantidad: 1, ...data };
            self.cardFlag = true;
          })
          .catch((error) => {
            self.triggerNegative(error.error);
          });
      } else {
        self.databaseGetProductInformation(data);
      }
    },
    getCustomerData(data) {
      let self = this;
      self.form.cliente_id = data.id;
      self.form.nombre_completo = data.nombres;
      self.form.cedula = data.cedula;
      self.form.saldo = data.valor;
      self.form.saldo_actual = data.valor;

      //Aqui devolver al stock, pero debo verificar si tiene un pedido guardado o una venta y solo la diferencia se debe devolbver

      if (self.form.productos.length > 0) {
        this.$axios
          .post(`api/devolver-cantidad-productos`, {
            ...self.form,
          })
          .then(({ data }) => {
            self.form.productos = [];
            self.form.descuento = 0.0;
            self.form.subtotal_iva = 0.0;
            self.form.subtotal = 0.0;
            self.form.total = 0.0;
            self.form.iva = 0.0;

            self.modalSearchClient = false;
            self.getSavedOrders();
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
    databaseLocalAddProducts(data) {
      let self = this;
      let args = {
        id: data.id,
        cantidad: data.cantidad,
        type: 1,
      };
      ipcRenderer
        .invoke("cambio-stock-producto", args)
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
        .catch((error) => {
          self.triggerNegative(error);
        });
    },
    addProducts(data) {
      let self = this;

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

      let online = navigator.onLine;
      //CAMBIAR
      if (!online) {
        this.$axios
          .get(`api/cambio-stock-producto/${data.id}/${data.cantidad}/1`)
          .then((response) => {
            let existingProduct = self.form.productos.find(
              (producto) => producto.producto_id === data.id
            );

            if (existingProduct) {
              // Si el producto ya existe, actualizar cantidad y total
              existingProduct.cantidad =
                parseFloat(existingProduct.cantidad) +
                parseFloat(data.cantidad); // Sumar la nueva cantidad
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
      } else {
        self.databaseLocalAddProducts(data);
      }
    },

    dataBaseLocalDeleteProduct(data, indice) {
      let self = this;
      let args = {
        id: data.producto_id,
        cantidad: data.cantidad,
        type: 2,
      };
      ipcRenderer
        .invoke("cambio-stock-producto", args)
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
        .catch((error) => {
          self.triggerNegative(error);
        });
    },
    deleteProduct(data, indice) {
      let self = this;

      let online = navigator.onLine;
      //CAMBIAR
      if (!online) {
        this.$axios
          .get(
            `api/cambio-stock-producto/${data.producto_id}/${data.cantidad}/2`
          )
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
      } else {
        self.dataBaseLocalDeleteProduct(data, indice);
      }
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
      self.isDisabled = true;
      this.$axios
        .post(`api/venta-encabezados`, { ...self.form })
        .then(({ data }) => {
          self.getClients();
          self.getProducts();
          self.getSavedOrders();
          self.triggerPositive("Venta Guardada");
          // Generar el recibo y enviarlo a la impresora
          const receiptContent = self.generateReceipt(self.form);
          self.printReceipt(receiptContent);

          self.clearForm();
          self.isDisabled = false;
        })
        .catch((error) => {
          self.isDisabled = false;
          if (error.response && error.response.data) {
            //Devuelvo todos los productos
            // Esto debo cabiar porque solo si tiene el ID comienzo a devolevr
            if (error.response.status === 409) {
              self.form.productos = [];
              self.form.descuento = 0.0;
              self.form.subtotal_iva = 0.0;
              self.form.subtotal = 0.0;
              self.form.total = 0.0;
              self.form.iva = 0.0;
              self.triggerNegative(`${error.response.data.message}`);
            }
          } else {
            self.triggerNegative("Ocurrió un error inesperado.");
          }
        });
    },
    generateReceipt(data) {
      var detalle = data.productos.map((producto) => {
        return `<tr><td>${producto.nombre}</td>
              <td>${producto.cantidad}</td>
              <td>$${producto.precio}</td>
              <td>$${producto.total}</td>
             </tr>`;
      });
      var detalleHTML = detalle.join("").toString();
      var html = `
        <div>
          <h2>Recibo de Entrega</h2>
          <p>Cliente: ${data.nombre_completo}</p>
          <p>Saldo Actual: ${data.saldo}</p>
          <p>Fecha: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${detalleHTML}
            </tbody>
          </table>
          <p>Subtotal:$ ${data.total}</p>
          <p>IVA: 0</p>
          <p>Total:$ ${data.total}</p>
        </div>
      `;

      return html;
    },
    save() {
      let self = this;
      self.isDisabled = true;
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
              self.isDisabled = false;
            })
            .catch((error) => {
              self.isDisabled = false;
              if (error.response && error.response.data) {
                //Devuelvo todos los productos

                //Debe Cambiar porque si tiene el id, debo devolver la diferencia de los productos que no esten
                if (error.response.status === 409) {
                  self.form.productos = [];
                  self.form.descuento = 0.0;
                  self.form.subtotal_iva = 0.0;
                  self.form.subtotal = 0.0;
                  self.form.total = 0.0;
                  self.form.iva = 0.0;

                  self.modalSearchClient = false;
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
              self.isDisabled = false;
            })
            .catch((error) => {
              self.isDisabled = false;
              if (error.response && error.response.data) {
                //Devuelvo todos los productos
                if (error.response.status === 409) {
                  self.form.productos = [];
                  self.form.descuento = 0.0;
                  self.form.subtotal_iva = 0.0;
                  self.form.subtotal = 0.0;
                  self.form.total = 0.0;
                  self.form.iva = 0.0;

                  self.modalSearchClient = false;

                  self.triggerNegative(`${error.response.data.message}`);
                }
              } else {
                self.triggerNegative("Ocurrió un error inesperado.");
              }
            });
        }
      } else {
        self.isDisabled = false;
        self.triggerNegative("Debe tener añadido por lo mínimo un producto");
      }
    },
    printReceipt(receiptContent) {
      ipcRenderer.send("print-receipt", receiptContent);
      console.log("terminado");
    },
    openModalClients() {
      let self = this;
      self.getClients();
      self.modalSearchClient = true;
    },
  },
  created() {
    this.getClients();
    this.getProducts();
    //Pendiente
    this.getSavedOrders();
  },
  mounted() {},
};
</script>

<style scoped>
.no-padding-no-margin {
  padding: 0 !important;
  margin: 0 !important;
}
.custom-font p {
  font-size: 16px;
  /* Ajusta el tamaño de letra según tus necesidades */
  white-space: normal;
  /* Permite que el texto se ajuste automáticamente */
  overflow: hidden;
  /* Oculta el exceso de texto */
  text-overflow: ellipsis;
  /* Agrega puntos suspensivos al final del texto que se desborda */
}

.my-img {
  width: 100%;
  /* Tamaño completo de la imagen dentro de la tarjeta */
  height: 120px;
  /* Altura específica para la imagen (ajustar según necesidades) */
  object-fit: cover;
  /* Ajuste para cubrir completamente el espacio asignado */
}

.my-card-2 {
  width: 200;
  max-width: calc(100% / 6 - 20px);
  /* Ancho máximo de cada tarjeta */
  margin: 10px;
  /* Margen entre tarjetas */
}

@media (max-width: 1560px) {
  .my-card-2 {
    max-width: calc(100% / 4 - 20px);
    /* Reducir el ancho máximo para pantallas más pequeñas */
  }
}

@media (max-width: 960px) {
  .my-card-2 {
    max-width: calc(100% / 2 - 20px);
    /* Reducir el ancho máximo para pantallas más pequeñas */
  }
}

@media (max-width: 600px) {
  .my-card-2 {
    max-width: calc(100% / 1 - 20px);
    /* Aún más reducido para pantallas muy pequeñas */
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
