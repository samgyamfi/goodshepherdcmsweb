<script setup>
import { DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";
import { computed } from "vue";

const props = defineProps({
  side: {
    type: String,
    required: false,
    default: "right",
    validator: (value) => ["top", "right", "bottom", "left"].includes(value),
  },
  class: { type: String, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
});

const emits = defineEmits(["update:open"]);

const forwarded = useForwardPropsEmits(props, emits);

const positionClasses = computed(() => {
  const classes = {
    top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    right: "inset-y-0 right-0 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
    bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
    left: "inset-y-0 left-0 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  };
  return classes[props.side] || classes.right;
});

const sizeClasses = computed(() => {
  const classes = {
    top: "w-full",
    right: "h-full w-[90vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[800px] 2xl:w-[1000px]",
    bottom: "w-full",
    left: "h-full w-[90vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[800px] 2xl:w-[1000px]",
  };
  return classes[props.side] || classes.right;
});
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"
    />
    <DialogContent
      :class="
        cn(
          'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500',
          positionClasses,
          sizeClasses,
          props.class,
        )
      "
      v-bind="forwarded"
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
