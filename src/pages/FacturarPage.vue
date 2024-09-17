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
                  <div class="col">{{ data.nombre }}</div>
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
        <q-toggle
          :label="online ? 'ONLINE' : 'OFFLINE'"
          color="green"
          v-model="online"
          @update:model-value="handleToggleChange"
        />
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

              <q-card-section class="row items-center">
                <div class="col">
                  <div class="text-subtitle2">
                    Centro de Costo: {{ form.centro_costo }}
                  </div>
                </div>

                <div class="col-auto">
                  <q-btn
                    color="info"
                    icon="search"
                    @click="openModalCostCenter"
                  />
                </div>
              </q-card-section>

              <q-card-section class="row items-center">
                <div class="col">
                  <div class="text-subtitle2">
                    Subcategoría: {{ form.subcategoria }}
                  </div>
                </div>

                <div class="col-auto">
                  <q-btn
                    color="info"
                    icon="search"
                    @click="openModalSubcategory"
                  />
                </div>
              </q-card-section>
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
                          type="parseFloat"
                          dense
                        />
                      </q-td>
                    </template> -->

                    <!-- <template v-slot:body-cell-precio="props">
                      <q-td :props="props">
                        <q-input v-model="props.row.precio" type="parseFloat" dense />
                      </q-td>
                    </template> -->

                    <template v-slot:body-cell-acciones="props">
                      <q-td :props="props">
                        <q-btn
                          color="negative"
                          icon="delete"
                          :disable="isDisabled"
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
            :disable="isDisabled"
            icon="save"
          />
          <q-btn
            @click="saveSale"
            :disable="block"
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
                    :disable="isDisabled"
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
              <q-icon name="search" />
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

    <q-dialog v-model="modalSearchSubcategory">
      <q-card style="width: 600px; max-width: 80vw">
        <q-toolbar>
          <q-avatar>
            <img
              src="https://contifico.com/wp-content/uploads/2020/06/isotipo-contifico-1.png"
            />
          </q-avatar>

          <q-toolbar-title class="text-center"
            >Listado de Subcategorías</q-toolbar-title
          >

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-input
            v-model="searchSubcategory"
            :input-debounce="500"
            label="Centro de Costo"
            ><template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-list bordered class="rounded-borders">
            <q-item
              clickable
              v-ripple
              v-for="(data, i) in subcategorias"
              :key="i"
            >
              <q-item-section @click="getSubcategoryData(data)">
                <q-item-label lines="1">{{ data.nombre }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalSearchCentroCosto">
      <q-card style="width: 600px; max-width: 80vw">
        <q-toolbar>
          <q-avatar>
            <img
              src="https://contifico.com/wp-content/uploads/2020/06/isotipo-contifico-1.png"
            />
          </q-avatar>

          <q-toolbar-title class="text-center"
            >Listado de Centro de Costo</q-toolbar-title
          >

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-input
            v-model="searchCentroCosto"
            :input-debounce="500"
            label="Centro de Costo"
            ><template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-list bordered class="rounded-borders">
            <q-item
              clickable
              v-ripple
              v-for="(data, i) in centro_costos"
              :key="i"
            >
              <q-item-section @click="getCostCenterData(data)">
                <q-item-label lines="1">{{ data.nombre }}</q-item-label>
              </q-item-section>
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
            :disable="isDisabled"
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
        centro_costo_id: null,
        centro_costo: "",
        subcategoria_id: null,
        subcategoria: "",
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
      pedidos_guardados: [],
      block: false,
      isDisabled: false,
      online: false,
      modalSearchCentroCosto: false,
      searchCentroCosto: "",
      centro_costos: [],
      modalSearchSubcategory: false,
      searchSubcategory: "",
      subcategorias: [],

      // online: navigator.onLine,
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
    searchCentroCosto(value) {
      let self = this;
      self.getCostCenter(value);
    },
    searchSubcategory(value) {
      let self = this;
      self.getSubcategory(value);
    },
  },
  methods: {
    handleToggleChange(value) {
      let self = this;

      if (value === false) {
        let productos = JSON.parse(JSON.stringify(self.form.productos));
        let form = {
          productos,
        };
        ipcRenderer
          .invoke("registar-movimiento", form)
          .then((response) => {
            if (!response.data.success) {
              // Maneja el error aquí si success es false
              let error = new Error("Error en la solicitud");
              let { data } = response;
              error.data = data;
              throw error;
            }

            self.clearForm();

            ipcRenderer.send("setGlobalVariable", value);
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            self.$router.push({ path: "/" });
          })
          .catch((error) => {
            self.online = true;
            if (error.data) {
              self.triggerNegative(`${error.data.message}`);
            } else {
              self.triggerNegative("Ocurrió un error inesperado.");
            }
          });

        // this.online = true;
      } else {
        if (self.form.id) {
          self.triggerNegative(
            "Ya existe un Pedido guardado con este cliente, por favor proceder a guardar nuevamente para cambiar a tipo ONLINE."
          );
          self.online = false;
          return;
        }

        if (self.form.productos.length > 0) {
          self.triggerNegative(
            "Debe eliminar los Productos para cambiar a tipo ONLINE"
          );
          self.online = false;
          return;
        }
        ipcRenderer.send("setGlobalVariable", value);
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        self.$router.push({ path: "/" });
      }

      console.log("El valor de 'online' ha cambiado:", value);
      // Aquí puedes llamar a la función que desees
    },
    recoverOrder(data, indice) {
      let self = this;
      self.form = { ...data };
      self.modalGuardadoClient = false;
      self.triggerPositive("Pedido Recuperado");
    },
    databaseLocalDeleteOrder(data, indice) {
      let self = this;
      ipcRenderer
        .invoke("pedidos-encabezados-delete", data.id)
        .then((response) => {
          if (!response.data.success) {
            // Maneja el error aquí si success es false
            let error = new Error("Error en la solicitud");
            let { data } = response;
            error.data = data;
            throw error;
          }
          self.isDisabled = false;
          self.pedidos_guardados.splice(indice, 1);
          self.triggerPositive("Pedido Eliminado");
        })
        .catch((error) => {
          self.isDisabled = false;
          if (error.data) {
            if (error.data.status === 409) {
              self.triggerNegative(`${error.data.message}`);
            } else {
              self.triggerNegative(`${error.data.message}`);
            }
          }
          self.triggerNegative(error);
        });
    },
    deleteOrder(data, indice) {
      let self = this;
      self.isDisabled = true;
      if (self.online) {
        this.$axios
          .delete(`api/pedidos-encabezados/${data.id}`)
          .then(({ data }) => {
            self.isDisabled = false;
            self.pedidos_guardados.splice(indice, 1);
            self.triggerPositive("Pedido Eliminado");
          })
          .catch((error) => {
            self.isDisabled = false;
            self.triggerNegative(error);
          });
      } else {
        self.databaseLocalDeleteOrder(data, indice);
      }
    },
    databaseLLocalGetSaveOrders() {
      let self = this;
      ipcRenderer
        .invoke("pedidos-encabezados-get")
        .then((data) => {
          console.log(data);
          self.pedidos_guardados = data;
        })
        .catch((error) => {
          self.triggerNegative(error);
        });
    },
    getSavedOrders() {
      let self = this;
      if (self.online) {
        this.$axios
          .get(`api/pedidos-encabezados`)
          .then(({ data }) => {
            self.pedidos_guardados = data;
          })
          .catch((error) => {
            self.triggerNegative(error);
          });
      } else {
        self.databaseLLocalGetSaveOrders();
      }
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
      if (self.online) {
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

      if (self.form.id) {
        self.triggerNegative(
          "Ya existe un Pedido guardado con este cliente, por favor proceder a guardar nuevamente."
        );
        return;
      }

      if (self.form.productos.length > 0) {
        self.triggerNegative(
          "Debe eliminar los Productos para cambiar de cliente"
        );
        return;
      }
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

      if (self.online) {
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
    dataBaseLocalCostCenter(nombres) {
      let self = this;
      ipcRenderer
        .invoke("get-cost-center", nombres)
        .then((data) => {
          self.clientes = data;
        })
        .catch((error) => {
          self.triggerNegative(error);
        });
    },
    getCostCenter(nombres = null) {
      let self = this;
      let filtro = "";
      if (nombres != null && nombres.length > 2) {
        filtro = `&nombre=${nombres}`;
      }

      if (self.online) {
        this.$axios
          .get(`/api/centro-costo-index?perPage=all${filtro}`)
          .then(({ data }) => {
            self.centro_costos = data;
          })
          .catch((error) => {
            self.triggerNegative(error.error);
          });
      } else {
        self.dataBaseLocalCostCenter(nombres);
      }
    },
    getSubcategory(nombres = null) {
      let self = this;
      let filtro = "";
      if (nombres != null && nombres.length > 2) {
        filtro = `&nombre=${nombres}`;
      }

      if (self.online) {
        this.$axios
          .get(`/api/subcategoria-index?perPage=all${filtro}`)
          .then(({ data }) => {
            self.subcategorias = data;
          })
          .catch((error) => {
            self.triggerNegative(error.error);
          });
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
        .invoke("producto-show", data.id)
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

      if (self.online) {
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
    databaseLocalGetCustomerData() {
      let self = this;
      let productos = JSON.parse(JSON.stringify(self.form.productos));
      let form = {
        ...self.form,
        productos,
      };
      ipcRenderer
        .invoke("devolver-cantidad-productos", form)
        .then((response) => {
          if (!response.data.success) {
            // Maneja el error aquí si success es false
            let error = new Error("Error en la solicitud");
            let { data } = response;
            error.data = data;
            throw error;
          }
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
          if (error.data) {
            self.triggerNegative(`${error.data.message}`);
          } else {
            self.triggerNegative("Ocurrió un error inesperado.");
          }
        });
    },
    getCostCenterData(data) {
      let self = this;
      if (!self.form.cliente_id) {
        self.triggerNegative("Es necesario que exista un cliente.");
        return;
      }
      self.form.centro_costo_id = data.id;
      self.form.centro_costo = data.nombre;
      self.modalSearchCentroCosto = false;
    },
    getSubcategoryData(data) {
      let self = this;
      if (!self.form.cliente_id) {
        self.triggerNegative("Es necesario que exista un cliente.");
        return;
      }
      self.form.subcategoria_id = data.id;
      self.form.subcategoria = data.nombre;
      self.modalSearchSubcategory = false;
    },
    getCustomerData(data) {
      let self = this;
      if (self.form.id) {
        self.triggerNegative(
          "Tienes un pedido actual, por favor proceder a guardar el pedido."
        );
        return;
      }

      if (self.form.productos.length > 0) {
        self.triggerNegative(
          "Debe eliminar los Productos para cambiar de cliente"
        );
        return;
      }
      self.form.id = "";
      self.form.cliente_id = data.id;
      self.form.nombre_completo = data.nombres;
      self.form.centro_costo_id = data.centro_costo_id;
      self.form.centro_costo = data.centro_costo;
      self.form.subcategoria_id = data.subcategoria_id;
      self.form.subcategoria = data.subcategoria;
      self.form.cedula = data.cedula;
      self.form.saldo = data.valor;
      self.form.saldo_actual = data.valor;

      //Aqui devolver al stock, pero debo verificar si tiene un pedido guardado o una venta y solo la diferencia se debe devolbver

      if (self.form.productos.length > 0) {
        if (self.online) {
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
          self.databaseLocalGetCustomerData();
        }
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
          console.log(response);
          if (!response.success) {
            let error = new Error("Error en la solicitud");
            error.data = response;
            throw error;
          }
          console.log(response);
          self.isDisabled = false;
          let existingProduct = self.form.productos.find(
            (producto) => producto.producto_id === data.id
          );

          if (existingProduct) {
            // Si el producto ya existe, actualizar cantidad y total
            existingProduct.cantidad =
              parseInt(existingProduct.cantidad) + parseInt(data.cantidad); // Sumar la nueva cantidad
            existingProduct.total =
              parseFloat(existingProduct.cantidad) *
              parseFloat(existingProduct.precio); // Recalcular el total
            existingProduct.total = Math.round(existingProduct.total * 100);
            existingProduct.total = parseFloat(
              (existingProduct.total / 100).toFixed(2)
            );
          } else {
            // Si el producto no existe, agregarlo a la lista
            let valuTotal = Math.round(data.precio * 100) * data.cantidad;

            valuTotal = parseFloat((valuTotal / 100).toFixed(2));

            self.form.productos.push({
              producto_id: data.id,
              nombre: data.nombre,
              img: data.img,
              cantidad: data.cantidad,
              precio: data.precio,
              total: valuTotal,
            });
          }

          self.form.total = self.form.productos.reduce((acc, producto) => {
            // Multiplica por 100 para trabajar con enteros
            let productoTotal = Math.round(producto.total * 100);
            return acc + productoTotal;
          }, 0);

          self.form.total = self.form.total / 100;

          self.form.total = parseFloat(self.form.total.toFixed(2));

          let sald2 =
            Math.round(self.form.saldo_actual * 100) -
            Math.round(self.form.total * 100);

          sald2 = sald2 / 100;

          self.form.saldo = parseFloat(sald2.toFixed(2));

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
          self.isDisabled = false;
          self.triggerNegative(`${error.data.error}`);
        });
    },
    addProducts(data) {
      let self = this;

      // parseInt(data.cantidad) > 0 &&
      if (parseInt(data.cantidad) == 0) {
        self.triggerNegative("La cantidad debe ser mayor a cero");

        return;
      }
      if (parseInt(data.cantidad) > parseInt(data.stock)) {
        self.triggerNegative("La cantidad debe ser menor o igual al Stock");

        return;
      }

      let total = self.form.productos.reduce((acc, producto) => {
        // Multiplica por 100 para trabajar con enteros
        let productoTotal = Math.round(producto.total * 100);
        return acc + productoTotal;
      }, 0);

      total = parseFloat(total.toFixed(2));

      let tvalue = parseFloat(data.cantidad) * parseFloat(data.precio);
      tvalue = parseFloat(tvalue.toFixed(2));
      tvalue = Math.round(tvalue * 100);
      total += tvalue;

      total = total / 100;

      total = parseFloat(total.toFixed(2));

      if (
        parseFloat(total) >
        parseFloat(parseFloat(self.form.saldo_actual).toFixed(2))
      ) {
        self.triggerNegative("No tiene suficiente saldo");
        return;
      }

      self.isDisabled = true;

      if (self.online) {
        this.$axios
          .get(`api/cambio-stock-producto/${data.id}/${data.cantidad}/1`)
          .then((response) => {
            self.isDisabled = false;
            let existingProduct = self.form.productos.find(
              (producto) => producto.producto_id === data.id
            );

            if (existingProduct) {
              // Si el producto ya existe, actualizar cantidad y total
              existingProduct.cantidad =
                parseInt(existingProduct.cantidad) + parseInt(data.cantidad); // Sumar la nueva cantidad
              existingProduct.total =
                parseFloat(existingProduct.cantidad) *
                parseFloat(existingProduct.precio); // Recalcular el total
              existingProduct.total = Math.round(existingProduct.total * 100);
              existingProduct.total = parseFloat(
                (existingProduct.total / 100).toFixed(2)
              );
            } else {
              // Si el producto no existe, agregarlo a la lista
              let valuTotal = Math.round(data.precio * 100) * data.cantidad;

              valuTotal = parseFloat((valuTotal / 100).toFixed(2));

              self.form.productos.push({
                producto_id: data.id,
                nombre: data.nombre,
                img: data.img,
                cantidad: data.cantidad,
                precio: data.precio,
                total: valuTotal,
              });
            }

            self.form.total = self.form.productos.reduce((acc, producto) => {
              // Multiplica por 100 para trabajar con enteros
              let productoTotal = Math.round(producto.total * 100);
              return acc + productoTotal;
            }, 0);

            self.form.total = self.form.total / 100;

            self.form.total = parseFloat(self.form.total.toFixed(2));

            let sald2 =
              Math.round(self.form.saldo_actual * 100) -
              Math.round(self.form.total * 100);

            sald2 = sald2 / 100;

            self.form.saldo = parseFloat(sald2.toFixed(2));

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
            console.log(error);
            self.isDisabled = false;
            if (error.response && error.response.data) {
              if (error.response.status === 409) {
                self.triggerNegative(`${error.response.data.message}`);
              }
            } else {
              self.triggerNegative(
                "Ha ocurrido un error al agregar el producto"
              );
            }
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
          self.isDisabled = false;
          self.form.productos.splice(indice, 1);

          self.form.total = self.form.productos.reduce((acc, producto) => {
            // Multiplica por 100 para trabajar con enteros
            let productoTotal = Math.round(producto.total * 100);
            return acc + productoTotal;
          }, 0);

          self.form.total = self.form.total / 100;
          self.form.total = parseFloat(self.form.total.toFixed(2));

          let r =
            Math.round(self.form.saldo_actual * 100) -
            Math.round(self.form.total * 100);
          r = r / 100;
          r = parseFloat(r.toFixed(2));
          self.form.saldo = r;
        })
        .catch((error) => {
          self.isDisabled = false;
          self.triggerNegative(error);
        });
    },
    databaseLocalDeleteDetailRequested(data, indice) {
      let self = this;
      let args = {
        id: data.id,
        producto_id: data.producto_id,
        cantidad: data.cantidad,
      };
      ipcRenderer
        .invoke("eliminar-pedido-detalle", args)
        .then((response) => {
          console.log("assagsgf");
          if (!response.data.success) {
            // Maneja el error aquí si success es false
            let error = new Error("Error en la solicitud");
            let { data } = response;
            error.data = data;
            throw error;
          }
          self.isDisabled = false;
          self.form.productos.splice(indice, 1);

          self.form.total = self.form.productos.reduce((acc, producto) => {
            // Multiplica por 100 para trabajar con enteros
            let productoTotal = Math.round(producto.total * 100);
            return acc + productoTotal;
          }, 0);

          self.form.total = self.form.total / 100;
          self.form.total = parseFloat(self.form.total.toFixed(2));

          let r =
            Math.round(self.form.saldo_actual * 100) -
            Math.round(self.form.total * 100);
          r = r / 100;
          r = parseFloat(r.toFixed(2));
          self.form.saldo = r;
        })
        .catch((error) => {
          self.isDisabled = false;
          if (error.data) {
            if (error.data.status === 409) {
              self.triggerNegative(`${error.data.message}`);
            } else {
              self.triggerNegative(`${error.data.message}`);
            }
          } else {
            self.triggerNegative("Ha ocurrido un error al eliminar");
          }
        });
    },
    deleteProduct(data, indice) {
      let self = this;
      self.isDisabled = true;
      if (data.id) {
        if (self.online) {
          this.$axios
            .get(
              `api/eliminar-pedido-detalle/${data.id}/${data.producto_id}/${data.cantidad}/2`
            )
            .then((response) => {
              self.isDisabled = false;
              self.form.productos.splice(indice, 1);

              self.form.total = self.form.productos.reduce((acc, producto) => {
                // Multiplica por 100 para trabajar con enteros
                let productoTotal = Math.round(producto.total * 100);
                return acc + productoTotal;
              }, 0);

              self.form.total = self.form.total / 100;
              self.form.total = parseFloat(self.form.total.toFixed(2));

              let r =
                Math.round(self.form.saldo_actual * 100) -
                Math.round(self.form.total * 100);
              r = r / 100;
              r = parseFloat(r.toFixed(2));
              self.form.saldo = r;
            })
            .catch((error) => {
              self.isDisabled = false;
              console.log(error);
              if (error.response && error.response.data) {
                if (error.response.status === 409) {
                  self.triggerNegative(`${error.response.data.message}`);
                }
              } else {
                self.triggerNegative("Ha ocurrido un error al eliminar");
              }
            });
        } else {
          self.databaseLocalDeleteDetailRequested(data, indice);
        }
      } else {
        if (self.online) {
          this.$axios
            .get(
              `api/cambio-stock-producto/${data.producto_id}/${data.cantidad}/2`
            )
            .then((response) => {
              self.isDisabled = false;
              self.form.productos.splice(indice, 1);

              self.form.total = self.form.productos.reduce(
                (acc, producto) => acc + producto.total,
                0
              );

              self.form.total = parseFloat(
                parseFloat(self.form.total).toFixed(2)
              );

              self.form.saldo =
                parseFloat(self.form.saldo_actual) -
                parseFloat(self.form.total);
              self.form.saldo = parseFloat(
                parseFloat(self.form.saldo).toFixed(2)
              );
            })
            .catch((error) => {
              self.isDisabled = false;
              if (error.response && error.response.data) {
                if (error.response.status === 409) {
                  self.triggerNegative(`${error.response.data.message}`);
                }
              } else {
                self.triggerNegative("Ha ocurrido un error al eliminar");
              }
            });
        } else {
          self.dataBaseLocalDeleteProduct(data, indice);
        }
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
        centro_costo_id: null,
        centro_costo: "",
        subcategoria_id: null,
        subcategoria: "",
      };
    },
    databaseLocalSaveSale() {
      let self = this;
      let productos = JSON.parse(JSON.stringify(self.form.productos));
      let form = {
        ...self.form,
        productos,
        user_id: localStorage.getItem("user_id"),
      };
      ipcRenderer
        .invoke("ventas-encabezados-store", form)
        .then((response) => {
          self.block = false;
          if (!response.data.success) {
            // Maneja el error aquí si success es false
            let error = new Error("Error en la solicitud");
            let { data } = response;
            error.data = data;
            throw error;
          }
          self.getClients();
          self.getProducts();
          self.getSavedOrders();
          self.triggerPositive("Venta Guardada");
          // Generar el recibo y enviarlo a la impresora
          const receiptContent = self.generateReceipt(self.form);
          self.printReceipt(receiptContent);

          self.clearForm();
        })
        .catch((error) => {
          self.block = false;
          if (error.data) {
            //Devuelvo todos los productos
            // Esto debo cabiar porque solo si tiene el ID comienzo a devolevr
            if (error.data.status === 409) {
              self.form.productos = [];
              self.form.descuento = 0.0;
              self.form.subtotal_iva = 0.0;
              self.form.subtotal = 0.0;
              self.form.total = 0.0;
              self.form.iva = 0.0;
              self.triggerNegative(`${error.data.message}`);
            } else {
              self.triggerNegative(`${error.data.message}`);
            }
          } else {
            self.triggerNegative("Ocurrió un error inesperado.");
          }
        });
    },
    async saveSale() {
      this.block = true;
      let self = this;
      if (self.form.productos.length > 0) {
        if (self.online) {
          await this.$axios
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
            })
            .catch((error) => {
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
          this.block = false;
        } else {
          self.databaseLocalSaveSale();
        }
      } else {
        self.triggerNegative("Debe seleccionar por lo mínimo un producto.");
        this.block = false;
      }
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
        <div style="font-size:10px;">
          <h4>Recibo de Entrega</h4>
          <p>Cliente: ${data.nombre_completo}</p>
          <p>Centro de Costo: ${data.centro_costo}</p>
          <p>Subcategoría: ${data.subcategoria}</p>
          <p>Saldo Actual: ${data.saldo}</p>
          <p>Fecha: ${new Date().toLocaleString()}</p>
          <table style="font-size:10px">
            <thead>
              <tr>
                <th>producto</th>
                <th>cant</th>
                <th>pre</th>
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
    databaseLocalSaveStore() {
      let self = this;
      let productos = JSON.parse(JSON.stringify(self.form.productos));
      let form = {
        ...self.form,
        productos,
        user_id: localStorage.getItem("user_id"),
      };
      ipcRenderer
        .invoke("pedidos-encabezados-store", form)
        .then((response) => {
          if (!response.data.success) {
            // Maneja el error aquí si success es false
            let error = new Error("Error en la solicitud");
            let { data } = response;
            error.data = data;
            throw error;
          }

          self.getClients();
          self.getProducts();
          self.getSavedOrders();
          self.triggerPositive("Guardado");
          self.clearForm();
          self.isDisabled = false;
        })
        .catch((error) => {
          self.isDisabled = false;
          if (error.data) {
            //Devuelvo todos los productos
            if (error.data.status === 409) {
              self.form.productos = [];
              self.form.descuento = 0.0;
              self.form.subtotal_iva = 0.0;
              self.form.subtotal = 0.0;
              self.form.total = 0.0;
              self.form.iva = 0.0;

              self.modalSearchClient = false;

              self.triggerNegative(`${error.data.message}`);
            } else {
              self.triggerNegative(`${error.data.message}`);
            }
          } else {
            self.triggerNegative("Ocurrió un error inesperado.");
          }
        });
    },
    databaseLocalSaveUpdate() {
      let self = this;
      let productos = JSON.parse(JSON.stringify(self.form.productos));
      let form = {
        ...self.form,
        productos,
        user_id: localStorage.getItem("user_id"),
      };
      ipcRenderer
        .invoke("pedidos-encabezados-update", form)
        .then((response) => {
          if (!response.data.success) {
            // Maneja el error aquí si success es false
            let error = new Error("Error en la solicitud");
            let { data } = response;
            error.data = data;
            throw error;
          }
          self.getClients();
          self.getProducts();
          self.getSavedOrders();
          self.triggerPositive("Guardado");
          self.clearForm();
          self.isDisabled = false;
        })
        .catch((error) => {
          self.isDisabled = false;
          if (error.data) {
            //Devuelvo todos los productos

            //Debe Cambiar porque si tiene el id, debo devolver la diferencia de los productos que no esten
            if (error.data.status === 409) {
              self.form.productos = [];
              self.form.descuento = 0.0;
              self.form.subtotal_iva = 0.0;
              self.form.subtotal = 0.0;
              self.form.total = 0.0;
              self.form.iva = 0.0;

              self.modalSearchClient = false;
              self.triggerNegative(`${error.data.message}`);
            } else {
              self.triggerNegative(`${error.data.message}`);
            }
          } else {
            self.triggerNegative("Ocurrió un error inesperado.");
          }
        });
    },
    save() {
      let self = this;
      self.isDisabled = true;
      if (self.form.productos.length > 0) {
        if (self.form.id) {
          //Verificar
          if (self.online) {
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
            self.databaseLocalSaveUpdate();
          }
        } else {
          if (self.online) {
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
          } else {
            self.databaseLocalSaveStore();
          }
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
    openModalCostCenter() {
      let self = this;
      self.getCostCenter();
      self.modalSearchCentroCosto = true;
    },
    openModalSubcategory() {
      let self = this;
      self.getSubcategory();
      self.modalSearchSubcategory = true;
    },
  },
  created() {
    let self = this;
    ipcRenderer.invoke("getGlobalVariable").then((value) => {
      self.online = value;
      console.log("Variable Global:", self.online);
      this.getClients();
      this.getProducts();
      this.getSavedOrders();
    });
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
