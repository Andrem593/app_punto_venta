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
              v-for="n in 10"
              :key="n"
            >
              <q-img
                src="https://cdn.quasar.dev/img/chicken-salad.jpg"
                class="my-img"
              />

              <q-card-section>
                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">Cafe Basilico</div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="center">
                <q-btn flat color="primary">Agregar</q-btn>
              </q-card-actions>
            </q-card>

            <q-card
              class="my-card my-card-2"
              flat
              bordered
              v-for="n in 5"
              :key="n"
            >
              <q-img
                class="my-img"
                src="https://contifico.com/wp-content/uploads/2020/06/isotipo-contifico-1.png"
              />

              <q-card-section>
                <div class="row no-wrap items-center">
                  <div class="col custom-font">
                    <strong
                      ><p>
                        Jabolsdsdsdsssdsssasas lava todo sahsagsagsah
                        gagsahsgagh saasaaaaaaaaaaaaaaaaaaa gaghggsaashahaaggagh
                        ahgsa
                      </p></strong
                    >
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions>
                <q-btn flat round icon="event" />
                <q-btn flat color="primary">Reserve</q-btn>
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
                  @click="toolbar = true"
                  color="secondary"
                  icon="person"
                  icon-right="search"
                  label="Cliente"
                />
              </q-card-section>
              <q-card-section class="text-center">
                <div class="text-h6">Marco Antonio cardenas Perez</div>
                <div class="text-subtitle2">0944296730</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="text-subtitle2">Productos:</div>
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

                  <!-- <q-intersection
                    v-for="index in 60"
                    :key="index"
                    transition="flip-right"
                    class="example-item"
                  >
                    <q-item clickable v-ripple>
                      <q-item-section avatar>
                        <q-avatar color="primary" text-color="white">
                          Q
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>Contact #{{ index }}</q-item-label>
                        <q-item-label caption lines="1"
                          >some@email.com</q-item-label
                        >
                      </q-item-section>

                      <q-item-section side>
                        <q-icon name="chat_bubble" color="green" />
                      </q-item-section>
                    </q-item>
                  </q-intersection> -->
                </q-card-actions>
              </div>
              <q-separator />
              <q-card-actions class="q-pa-sm">
                <div class="row items-center" style="width: 100%">
                  <q-item-label class="col text-start">Descuento:</q-item-label>
                  <div class="col-auto row justify-end">
                    <q-item-label class="col text-start">$0.00</q-item-label>
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
                    <q-item-label class="col text-start">$60.00</q-item-label>
                  </div>
                </div>
              </q-card-actions>
              <q-card-actions class="q-pa-sm">
                <div class="row items-center" style="width: 100%">
                  <q-item-label class="col text-start">Subtotal:</q-item-label>
                  <div class="col-auto row justify-end">
                    <q-item-label class="col text-start">$60.00</q-item-label>
                  </div>
                </div>
              </q-card-actions>
              <q-card-actions class="q-pa-sm">
                <div class="row items-center" style="width: 100%">
                  <q-item-label class="col text-start">IVA:</q-item-label>
                  <div class="col-auto row justify-end">
                    <q-item-label class="col text-start">$10.00</q-item-label>
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
                >$10.00</q-item-label
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="toolbar">
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
            <template v-slot:after>
              <q-btn round dense flat icon="add" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-list bordered class="rounded-borders">
            <q-item clickable v-ripple v-for="i in 25" :key="i">
              <q-item-section>
                <q-item-label lines="1"
                  >Marco Antonio Cardenas Perez</q-item-label
                >
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">0944296731</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side top>marco@gmail.com</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      model: ref("one"),
      secondModel: ref("one"),
      toolbar: ref(false),
    };
  },
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
