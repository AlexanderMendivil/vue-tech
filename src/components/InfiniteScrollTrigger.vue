<template>
    <template v-if="infiniteLoading">
        <v-progress-circular 
            indeterminate
            color="primary"
        />    
    </template>

    <div ref="scrollTrigger"></div>

</template>

<script setup lang="ts">
    import { onMounted, ref, toRefs } from 'vue';

    const props = defineProps({
        /// value from 1 to 0
        // 1 whole element should be visible
        // 0 as soon as it shows up
        numVisibilityRequired: {
            type: Number,
            default: 1
        },
        infiniteLoading: {
            default: true,
        }
    });

    const { numVisibilityRequired, infiniteLoading } = toRefs(props);

    const emit = defineEmits(['onIntersection']);

    const observer = ref();
    const scrollTrigger = ref(null);

    onMounted(() => {
        observer.value = new IntersectionObserver(e => {
            fireIntersect(e[0]);
        }, {
            threshold: numVisibilityRequired.value
        });

        observer.value.observe(scrollTrigger.value);
    });

    const fireIntersect = (element) => {
        if(element.isIntersecting) {
            emit("onIntersection");
        }
    }

</script>

<style>

</style>