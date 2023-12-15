<script lang="ts" setup>
import TagLink from '@/components/TagLink/TagLink.vue'
import { CloseOutlined } from '@ant-design/icons-vue'

import type { ITagLinkItem } from '@/types/index'

import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { throttle } from '@/utils/index'
import { useSettingStore } from '@/stores/setting'

const scrollElement = ref<HTMLElement | null>(null)
const onWheel = throttle((e: WheelEvent) => {
  scrollElement.value!.scrollLeft += e.deltaY * 0.5
}, 100)

type Item = {
  path: string
  title: string
}
const isEqual = (a: Item, b: Item) => {
  // 判断title是为了解决动态路由(/example/:id)的问题，也不想存在多个一样title的tagLink
  if (a.path === b.path || a.title === b.title) {
    return true
  }

  return false
}

const settingStore = useSettingStore()
const tags = ref<ITagLinkItem[]>([])

watch(
  () => settingStore.defaultTagLinks,
  (defaultTagLinks) => {
    if (!tags.value.length) {
      tags.value = defaultTagLinks
      return
    }

    tags.value = tags.value.filter((item) => {
      return !defaultTagLinks.some((defaultItem) => isEqual(item, defaultItem))
    })

    tags.value.unshift(...defaultTagLinks)
  },
  {
    immediate: true
  }
)

const route = useRoute()
watch(
  () => route.path,
  (path) => {
    const title = (route.meta.title as string) || (route.name as string)
    if (!title) {
      return
    }

    tags.value.forEach((item) => {
      if (item.checked) {
        item.checked = false
      }
    })

    const tag = tags.value.find((item) => isEqual(item, { path, title }))
    if (tag) {
      tag.path = route.fullPath
      tag.checked = true
      return
    }

    tags.value.push({
      title,
      path: route.fullPath,
      checked: true
    })
  },
  {
    immediate: true
  }
)

const router = useRouter()
const onClose = (index: number) => {
  const tag = tags.value.splice(index, 1)

  if (tag[0].checked) {
    const lastTag = tags.value[index - 1]
    if (lastTag) {
      lastTag.checked = true
      router.push(lastTag.path)
    }
  }
}
</script>

<template>
  <div ref="scrollElement" class="scrollbar-wrap" @wheel="onWheel">
    <div class="scrollbar flex">
      <TransitionGroup name="tags">
        <TagLink
          v-for="(item, idx) in tags"
          :key="item.path"
          :title="item.title"
          :checked="item.checked"
          :path="item.path"
        >
          <div v-if="!item.hiddenCloseIcon" class="icon--close" @click.stop="onClose(idx)">
            <CloseOutlined />
          </div>
        </TagLink>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scrollbar-wrap {
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 0px;
  }
}

.scrollbar {
  padding-top: 4px;
  width: 100%;
  height: 30px;
  border-bottom: 1px solid var(--st-c-divider);

  .icon--close {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
    width: 14px;
    height: 14px;
    border-radius: 50%;

    &:hover {
      color: var(--st-c-text-3);
      background-color: #79bbff;
    }
  }
}

.tags-move, /* 对移动中的元素应用的过渡 */
.tags-enter-active,
.tags-leave-active {
  transition: all 0.5s ease;
}

.tags-enter-from,
.tags-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.tags-leave-active {
  position: absolute;
}
</style>
