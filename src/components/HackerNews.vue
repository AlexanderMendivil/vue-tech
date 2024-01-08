<template>
    <v-container class="fluid">
        <v-col>
            <template v-if="firstLoading">
                <v-progress-circular
                    indeterminate
                    color="primary"
                />  
            </template>

            <template v-else>
                {{ news.length }}
                <template
                    v-for="article in news"
                    class="d-flex" 
                >
                    <news-article 
                        :article="article"
                        :num-comments="article?.kids?.length ?? 0"
                    />
                </template>
                
                <infinite-scroll-trigger
                    :infiniteLoading="infiniteLoading" 
                    @on-intersection="loadMoreNews"
                />
            </template>

        </v-col>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue';
import NewsArticle from '@/components/NewsArticle.vue';
import InfiniteScrollTrigger from '@/components/InfiniteScrollTrigger.vue';
import hackerNewsAPI from '@/api/hackerNewsAPI';

const props = defineProps({
    /// Decides the number of top news to display at first
    numTopNews: {
        type: Number,
        default: 10,
    } 
});

const { numTopNews } = toRefs(props);

// Type of item needed for it to be a hacker news
const newsTypeNeeded = "story";

// The Ids of the top news to load
const topNewsIds = ref([]);
const news = ref([]);

const infiniteLoading = ref(false);
// Indicates the first load with the number of [numTopNews] items
const firstLoading = ref(true);
// Last id checked for infinite scroll
const lastIdChecked = ref(0);

onMounted(async () => {
    topNewsIds.value = await fetchTop500NewsIds();
    await fecthNews(topNewsIds.value);
    await loadMoreNews();
});

const fetchTop500NewsIds = async () => {
    
    const resp = await hackerNewsAPI.getTop500News();

    if(resp.status != 200) {
        return;
    }

    return resp.data.slice(0, numTopNews.value);
}

const fecthNews = async (newsArray: Array<number>) => {
    firstLoading.value = true;
    if(!newsArray) return [];

    for (let index = 0; index < newsArray.length; index++) {
        
        const resp = await hackerNewsAPI.getHackerNewsItem(newsArray[index]);

        if(resp.status != 200) {
            continue;
        }
        
        news.value.push(resp.data);
    }
    firstLoading.value = false;
};

const loadMoreNews = async () => {

    // If we're already loading the next items, do nothing
    if(infiniteLoading.value) return;

    infiniteLoading.value = true;

    if((news.value?.length ?? 0) <= 0) return;

    const lastArticle = news.value.slice(-1)[0];

    if(lastIdChecked.value == 0) {
        lastIdChecked.value = lastArticle.id;
    }
    
    console.log(lastIdChecked.value);

    // Use last id checked to create an array of the next 10 ids to load always summing one to lastArticle.id
    const newIdsToLoad = Array.from({length: 10}, (v, k) => lastIdChecked.value - (k + 1));

    for (let index = 0; index < newIdsToLoad.length; index++) {

        lastIdChecked.value = newIdsToLoad[index];

        const resp = await hackerNewsAPI.getHackerNewsItem(newIdsToLoad[index]);

        if(resp.status != 200) {
            continue;
        }

        // If the item is not of the right type, skip
        if(resp?.data?.type != newsTypeNeeded) {
            continue;
        }

        // If the item is dead or deleted, skip
        // Happens frequently, items are either dead or deleted
        if(resp?.data?.dead || resp?.data?.deleted) {
            continue;
        }

        news.value.push(resp.data);
    }

    infiniteLoading.value = false;
}

</script>

<style scoped>
.pointed-cursor {
    cursor: pointer;
}
</style>