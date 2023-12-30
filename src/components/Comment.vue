<template>
    <v-list-item 
        :style=" `transform: translate(${level*40}px)`"
    >
        <template v-slot:title>
            <div v-html="commentItem.text"></div>
        </template>

        <template v-slot:subtitle>
            *{{ commentItem.by }}
        </template>

    </v-list-item>

    <template
        v-if="commentChildren"
    >        
        <template 
            v-for="(commentItemChild, index) in commentChildren"
        >

            <comment
                :commentItem="commentItemChild"
                :level="level+1"
                :commentChildrenIds="commentItemChild.kids"
            />

        </template>
    </template>
    

</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import { useGetChildComments } from "@/composables/articleComments";

const props = defineProps({
  /// [OBJECT]
  /// {
  ///     text: string
  ///     by: string
  /// } 
  commentItem: {
    type: Object
  },
  /// Must contain an array of the Ids of children comments to load
  /// Example: [ 123, 456, 789 ]
  commentChildrenIds: {
    type: Array,
  },
  /// The indentation level the initial component has
  level: {
    type: Number,
    default: 0,
  }
});

const { commentItem, commentChildrenIds, level } = toRefs(props);
const commentChildren = ref([]);

useGetChildComments

onMounted(async () => {
    commentChildren.value = await useGetChildComments(commentChildrenIds.value);
});

</script>

<style>

</style>