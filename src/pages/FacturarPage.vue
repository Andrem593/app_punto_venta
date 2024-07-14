<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-sm-12 col-xs-12 col-md-9">
        <q-input filled v-model="text" class="text-h6" />
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
            { label: 'Option 1', value: 'one' },
            { label: 'Option 2', value: 'two' },
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

              <q-card-actions>
                <q-btn flat round icon="event" />
                <q-btn flat color="primary">Reserve</q-btn>
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

        <div class="flex justify-center q-pa-sm">
          <q-chip
            class="col"
            v-model="vanilla"
            color="primary"
            text-color="white"
            icon="cake"
            label="vanillaLabel"
            title="vanillaLabel"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      model: ref("one"),
      secondModel: ref("one"),
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
