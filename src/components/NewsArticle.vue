<template>
    <v-container class="fluid">
        <v-card 
            class="pointed-cursor" 
            style="margin-top: 10px; margin-bottom: 10px"
            elevation="0"
            @click="goToArticle()"
        >
            <v-card-title>
                {{ article?.title }}
            </v-card-title>

            <v-card-subtitle>
                By: {{ article?.by }}

                <v-col>
                    <v-row class="align-center">

                        <template v-if="article?.url">
                            <v-btn
                                :href="article.url"
                                color="teal-accent-4"
                                variant="outlined"
                            >
                                Check it out!
                            </v-btn>
                        </template>
                        <template v-else>
                            <v-btn
                                color="red-accent-4"
                                variant="outlined"
                            >
                                {{ msjNotFoundUrl }}
                            </v-btn>
                        </template>

                        <div class="ml-4">
                            <span class="mr-2 ml-2 text-subtitle-1">
                                {{ numComments }}
                            </span>
                            <v-icon>mdi-comment-text-outline</v-icon>
                        </div>
                        
                    </v-row>
                </v-col>
            </v-card-subtitle>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { toRefs } from 'vue';

const props = defineProps({
    /// News artcle [OBJECT]
    /// {
    ///     id: number
    ///     title: string
    ///     by: string
    ///     url: string
    /// }
    article: {
        type: Object,
    },
    /// Number of comments the article has
    numComments: {
        type: Number,
        default: 0
    }
});

const router = useRouter();

const { article } = toRefs(props);

const msjNotFoundUrl = "URL NOT AVAILABLE"

const goToArticle = () => {
    router.push({ name: 'Article', params: { itemId: article?.value?.id } });
}

</script>

