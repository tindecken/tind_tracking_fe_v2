<template>
  <q-layout>
    <q-page-container>
      <q-page class="row items-center justify-center">
        <div class="text-center">
          <div v-if="session.data" class="q-mb-lg">
            <p class="text-h5 text-weight-bold">Welcome, {{ session.data.user.name }}</p>
            <p class="text-subtitle1 text-grey-7">{{ session.data.user.email }}</p>
          </div>
          <p v-else class="text-h5 text-weight-bold text-grey-7">
            You are not logged in
          </p>
          <q-btn
            color="primary"
            icon="logout"
            label="Logout"
            no-caps
            size="lg"
            :disable="!session.data"
            @click="signOut"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { authClient } from '@/boot/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const session = authClient.useSession();

const signOut = async () => {
  await authClient.signOut();
  void router.push('/login');
};
</script>
