<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md q-gutter-md" style="width: 400px; padding: 20px">
      <div class="text-center">
        <q-img
          src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
          style="width: 150px; margin-bottom: 20px"
        />
      </div>
      <div class="q-pa-md">
        <q-form @submit="login">
          <div class="q-gutter-y-md column" style="max-width: 400px">
            <q-input
              label="Correo"
              placeholder="Ingrese Correo"
              v-model="form.email"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Escribir el correo',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input
              label="Contraseña"
              v-model="form.password"
              placeholder="Ingrese Contraseña"
              class="q-mb-md"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Escribir la contraseña',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
            <q-btn
              type="submit"
              label="Ingresar"
              color="primary"
              class="full-width"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-page>
</template>
<script>
// import { ref } from "vue";
const { ipcRenderer } = require("electron");

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      users: [],
    };
  },
  mounted() {
    // this.getUsers();
  },
  methods: {
    async prueba() {
      // const users = await ipcRenderer.replicateClientes();
    },
    // async getUsers() {
    //   try {
    //     const users = await ipcRenderer.invoke("get-users");
    //     this.users = users;
    //   } catch (err) {
    //     console.error(
    //       "Error al obtener usuarios desde el proceso principal:",
    //       err
    //     );
    //   }
    // },
    // getClients() {
    //   console.log("sssggh");
    //   let self = this;
    //   this.$axios
    //     .get(`api/clientes`)
    //     .then(({ data }) => {
    //       console.log(data);
    //     })
    //     .catch((error) => {
    //       self.triggerNegative(error.error);
    //     });
    // },
    async login() {
      let self = this;
      self.prueba();

      let online = navigator.onLine;

      if (online) {
        self.triggerPositive("En linea");
      } else {
        self.triggerNegative("NO tiene internet");
      }
      console.log(self.form);

      try {
        const response = await this.$axios.post("/api/login", {
          email: self.form.email,
          password: self.form.password,
        });
        console.log(response);
        const token = response.data.access_token;
        localStorage.setItem("token", token);
        self.triggerPositive("Correo Y password correctos");
        self.$router.push({ path: "/principal" });
      } catch (error) {
        self.triggerNegative("Usuario o contraseña incorrectos");
      }
    },

    async logout() {
      try {
        await this.$axios.post("/api/logout");
        localStorage.removeItem("token"); // Elimina el token del almacenamiento
        this.$router.push({ name: "login" }); // Redirige a la página de login
      } catch (error) {
        console.error(error);
        // Manejar error de logout
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
  },
};
</script>
