<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-sm-12 col-xs-12 col-md-9">
        <q-input v-model="text" class="text-h6">
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
          size="25px"
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
              class="my-card my-card-2"
              flat
              bordered
              v-for="(data, index) in products"
              :key="index"
            >
              <q-img :src="data.img" class="my-img" />

              <q-card-section>
                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">{{ data.nombre }}</div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="center">
                <q-btn flat color="primary">Agregar</q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <q-separator spaced />
      </div>
      <div class="col-sm-12 col-xs-12 col-md-3">
        <div class="q-pa-md">
          <div class="justify-center">
            <q-card class="my-card" flat bordered>
              <q-card-section class="text-right">
                <q-btn
                  @click="modalSearchClient = true"
                  color="secondary"
                  icon="person"
                  icon-right="search"
                  label="Cliente"
                />
              </q-card-section>
              <q-card-section class="text-center">
                <div class="text-h6">{{ form.nombre_completo }}</div>
                <div class="text-subtitle2">{{ form.cedula }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="text-subtitle2">Saldo: ${{ form.saldo }}</div>
              </q-card-section>

              <q-separator />
              <q-card-section>
                <div class="q-pa-md">
                  <q-table
                    style="height: 400px"
                    flat
                    bordered
                    ref="tableRef"
                    title="Treats"
                    :rows="rows"
                    :columns="columns"
                    :table-colspan="9"
                    row-key="index"
                    virtual-scroll
                  ></q-table>
                </div>
              </q-card-section>

              <q-separator />

              <div style="max-height: 30vh" class="scroll">
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
              </div>
              <q-separator />
              <q-card-actions class="q-pa-sm">
                <div class="row items-center" style="width: 100%">
                  <q-item-label class="col text-start">Descuento:</q-item-label>
                  <div class="col-auto row justify-end">
                    <q-item-label class="col text-start"
                      >${{ form.descuento }}</q-item-label
                    >
                  </div>
                </div>
              </q-card-actions>
              <q-separator />

              <q-card-actions class="q-pa-sm">
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
              </q-card-actions>
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
              >TOTAL</q-item-label
            >
            <div class="col-auto row justify-end">
              <q-item-label class="col text-start" style="color: white"
                >${{ form.total }}</q-item-label
              >
            </div>
          </div>
        </div>
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
      products: [],
      clientes: [
        {
          id: 1,
          nombre_completo: "MARCO ANTONIO CARDENAS PEREZ",
          cedula: "0944296730",
          correo: "1",
          saldo: 100,
        },
        {
          id: 2,
          nombre_completo: "JUAN ALEXANDER PEREZ GUAMAN",
          cedula: "0944289545",
          correo: "saddsdas",
          saldo: 100,
        },
        {
          id: 3,
          nombre_completo: "JOSE BOLIVAR CARDENAS PEREZ",
          cedula: "0944289545",
          correo: "sadasds",
          saldo: 100,
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
          saldo: 100,
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
          name: "desc",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
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
      ],
      form: {
        cliente_id: "",
        nombre_completo: "",
        cedula: "",
        saldo: 0.0,
        productos: [],
        descuento: 0.0,
        subtotal_iva: 0.0,
        subtotal: 0.0,
        total: 0.0,
        iva: 0.0,
      },
    };
  },
  watch: {},
  methods: {
    getCustomerData(data) {
      let self = this;
      self.form.id = data.id;
      self.form.nombre_completo = data.nombre_completo;
      self.form.cedula = data.cedula;
      self.form.saldo = data.saldo;

      self.modalSearchClient = false;
      console.log(data);
    },
  },
  created() {
    for (let index = 0; index < 22; index++) {
      this.products.push({
        id: index,
        img: "https://cdn.quasar.dev/img/chicken-salad.jpg",
        nombre: `Prueba ${index}`,
        stock: 20,
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
  width: 250px;
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
</style>
