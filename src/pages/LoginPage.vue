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
        <q-toggle
          :label="online ? 'ONLINE' : 'OFFLINE'"
          color="green"
          v-model="online"
          @update:model-value="handleToggleChange"
        />
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
// const { ipcRenderer } = require("electron");
const { ipcRenderer } = require("electron");

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      users: [],
      online: true,
    };
  },
  mounted() {
    // this.getUsers();
  },
  methods: {
    handleToggleChange(value) {
      let self = this;
      ipcRenderer.send("setGlobalVariable", value);
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
    databaseLocalLogin() {
      let self = this;
      let form = {
        email: self.form.email,
        password: self.form.password,
      };
      ipcRenderer
        .invoke("login", form)
        .then((response) => {
          if (!response.data.success) {
            // Maneja el error aquí si success es false
            let error = new Error("Error en la solicitud");
            let { data } = response;
            error.data = data;
            throw error;
          }
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_id", response.data.user_id);
          self.triggerPositive("Correo Y password correctos");
          self.$router.push({ path: "/principal" });
          console.log(response);
        })
        .catch((error) => {
          if (error.data) {
            self.triggerNegative(`${error.data.message}`);
          } else {
            self.triggerNegative("Ocurrió un error inesperado.");
          }
        });
    },
    async login() {
      let self = this;
      console.log(self.form);

      if (self.online) {
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
          // this.$router.push({ name: "home" });
        } catch (error) {
          self.triggerNegative("Usuario o contraseña incorrectos");
          console.error(error);
          // Handle login error
        }
      } else {
        self.databaseLocalLogin();
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
  created() {
    let self = this;
    ipcRenderer.invoke("getGlobalVariable").then((value) => {
      self.online = value;
    });
  },
};
</script>
