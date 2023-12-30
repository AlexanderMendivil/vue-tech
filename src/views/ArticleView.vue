<template>
    <v-container class="fluid">
        <v-btn
            @click="router.go(-1)"
            color="black"
            variant="elevated"
            icon="mdi-arrow-left"
        />

        <v-row class="mt-6">
            <v-list>
                <template v-for="(comment, index) in comments">
                    <comment
                        :commentItem="comment"
                        :commentChildrenIds="comment?.kids"
                    />
                    <v-divider></v-divider>

                </template>
            </v-list>

        </v-row>

    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGetChildComments } from "@/composables/articleComments";
import hackerNewsAPI from '@/api/hackerNewsAPI';
import Comment from '@/components/Comment.vue';

const route = useRoute();
const router = useRouter();

const { itemId } = route.params;
const story = ref(null);
const comments = ref([]);

const getArticleItem = async (itemId) => {
    const resp = await hackerNewsAPI.getHackerNewsItem(itemId);
    if(resp.status != 200) {
        return;
    }
    return resp.data;
}

onMounted(async () => {
    story.value = await getArticleItem(itemId);
    
    comments.value = await useGetChildComments(story.value?.kids);
});

</script>

<style>

</style>