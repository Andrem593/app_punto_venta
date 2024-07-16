<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md q-gutter-md" style="width: 400px; padding: 20px">
      <div class="text-center">
        <q-img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" style="width: 150px; margin-bottom: 20px" />
      </div>
      <div class="q-pa-md">
        <div class="q-gutter-y-md column" style="max-width: 400px">
          <q-input label="Correo" placeholder="Ingrese Correo">
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input label="Contraseña" placeholder="Ingrese Contraseña" class="q-mb-md">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>
          <q-btn type="button" label="Ingresar" color="primary" class="full-width" />
        </div>

        <h2>Listado de Usuarios</h2>
        <ul>
          <li v-for="user in users" :key="user.id">
            {{ user.name }} - {{ user.email }}
          </li>
        </ul>
      </div>
    </q-card>
  </q-page>
</template>
<script>
import { ref } from "vue";
const { ipcRenderer } = require("electron");

export default {
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        const users = await ipcRenderer.invoke("get-users");
        this.users = users;
      } catch (err) {
        console.error("Error al obtener usuarios desde el proceso principal:", err);
      }
    },
  }
};
</script>
