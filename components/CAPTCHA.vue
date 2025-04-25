<template>
  <div class="w-full h-full bg-sky-950 p-1">
    <Card class=" m-5">
      <!-- Header -->
      <h2 class="text-2xl text-center ">For your security:</h2>
      <h2 class="text-2xl text-center font-bold -mt-5 -mb-5">Select all images containing: {{ topic }}</h2>
      <!-- Image Grid -->
      <div class="grid grid-cols-4 gap-1 p-5">
        <div
            v-for="(image, index) in displayImages"
            :key="index"
            class="relative aspect-square overflow-hidden"
            @click="toggleSelection(index)">

          <img :src="image.path" alt="Captcha image" class="rounded-xl w-full h-full object-cover"/>

          <div v-if="selectedImages.includes(index)"
               class="absolute inset-0 bg-stone-500/80 rounded-xl flex items-center justify-center">
            <Icon class="p-8 bg-white" name="lets-icons:check-fill"></Icon>
          </div>
        </div>
      </div>

      <div class="inline-flex">
        <Button @click="verifyCaptcha" class="ms-5 me-auto -mt-5 text-2xl p-7" :disabled="isVerifying">
          <Icon class="p-3" name="icomoon-free:clipboard"></Icon>
          {{ isVerifying ? 'Verifying...' : 'Verify' }}
        </Button>
        <Button class="ms-auto -mt-5 me-5 text-2xl p-7" @click="resetCaptcha">
          <h1>Reload</h1>
          <Icon class="p-3" name="ci:arrow-reload-02"></Icon>
        </Button>
      </div>
    </Card>
  </div>

  <!-- Verification Result Modal -->
  <div v-if="showResult" class="fixed inset-0 flex items-center justify-center bg-stone-900/95 z-50">
    <Card class="shadow-lg max-w-sm w-full">
      <div class="text-center">
        <div v-if="isSuccess" class="text-green-500 mx-auto mb-4">
          <Icon class="p-10" name="line-md:circle-filled-to-confirm-circle-filled-transition"></Icon>
        </div>
        <div v-else class="text-red-500 mx-auto mb-4">
          <Icon class="p-10" name="line-md:close-circle-filled"></Icon>
        </div>
        <h3 class="text-lg font-medium mb-2">
          {{ isSuccess ? 'Verification Successful' : 'Verification Failed' }}
        </h3>
        <p class="text-gray-600 mb-4">{{
            isSuccess ? 'You have successfully showed humanity.' : 'Please try again.'
          }}</p>
        <Button @click="closeResult" class="px-4 py-2">{{ isSuccess ? 'Continue' : 'Try Again' }}</Button>
      </div>
    </Card>
  </div>
</template>

<script setup>
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';


// Props for customization
const props = defineProps({
  //destination after successful completion
  dest: {
    type: String,
    default: '/',
  },
  // Available topic images (from images/[topic] folder)
  topicImages: {
    type: Array,
    default: () => []
  },
  // Available other images (from images/redherring folder)
  otherImages: {
    type: Array,
    default: () => []
  },
  // Number of images to show (default 9 for 3x3 grid)
  imageCount: {
    type: Number,
    default: 16
  },
  // Minimum number of correct images to include
  minCorrectImages: {
    type: Number,
    default: 3
  },
  // Maximum number of correct images to include
  maxCorrectImages: {
    type: Number,
    default: 8
  }
});

// State
const displayImages = ref([]);
const selectedImages = ref([]);
const correctIndices = ref([]);
const isVerifying = ref(false);
const showResult = ref(false);
const isSuccess = ref(false);

function pickTopic() {
  const options = ['cars', 'coffee', 'birds', 'breakfast', 'feet'];
  const random = Math.floor(Math.random() * options.length);
  let topic = options[random];

  return topic;
}

let topic = pickTopic();


// Topic images
const defaultTopicImages = computed(() => {
  return Array.from({length: 15}, (_, i) => ({
    id: `topic-${i}`,
    path: `images/${topic}/image${i + 1}.jpg`
  }));
});

//Red herrings
const defaultOtherImages = computed(() => {
  return Array.from({length: 15}, (_, i) => ({
    id: `other-${i}`,
    path: `images/redherring/image${i + 1}.jpg`
  }));
});


// Get available images
const availableTopicImages = computed(() => {
  return props.topicImages.length > 0 ? props.topicImages : defaultTopicImages.value;
});

const availableOtherImages = computed(() => {
  return props.otherImages.length > 0 ? props.otherImages : defaultOtherImages.value;
});

// Shuffle images
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Images for the captcha
const generateCaptchaImages = () => {
  // Determine how many correct images to include
  const correctCount = Math.floor(Math.random() *
      (props.maxCorrectImages - props.minCorrectImages + 1)) + props.minCorrectImages;

  // Make sure we don't try to use more images than available
  const actualCorrectCount = Math.min(correctCount, availableTopicImages.value.length);
  const incorrectCount = props.imageCount - actualCorrectCount;
  const actualIncorrectCount = Math.min(incorrectCount, availableOtherImages.value.length);


  // Shuffle and select the correct images
  const shuffledTopicImages = shuffleArray(availableTopicImages.value)
      .slice(0, actualCorrectCount)
      .map(img => ({...img, isCorrect: true}));

  // Shuffle red herrings
  const shuffledOtherImages = shuffleArray(availableOtherImages.value)
      .slice(0, actualIncorrectCount)
      .map(img => ({...img, isCorrect: false}));

  // Shuffle all images
  const allImages = shuffleArray([...shuffledTopicImages, ...shuffledOtherImages]);

  // Update the correct indices
  correctIndices.value = allImages
      .map((img, idx) => img.isCorrect ? idx : -1)
      .filter(idx => idx !== -1);

  return allImages;
};

// Initialize images
const initializeCaptcha = () => {
  displayImages.value = generateCaptchaImages();
  selectedImages.value = [];
};

// Watch for topic changes to reset the captcha
watch(() => topic, () => {
  pickTopic();
  initializeCaptcha();

});

// Initialize on mount
onMounted(() => {
  initializeCaptcha();
});

// Toggle image selection
const toggleSelection = (index) => {
  if (selectedImages.value.includes(index)) {
    selectedImages.value = selectedImages.value.filter(i => i !== index);
  } else {
    selectedImages.value.push(index);
  }
};

// Verify the captcha
const verifyCaptcha = () => {
  isVerifying.value = true;

  // Simulate verification delay
  setTimeout(() => {
    // Check if all selected images are correct and all correct images are selected
    const allSelectedAreCorrect = selectedImages.value.every(index =>
        correctIndices.value.includes(index)
    );

    const allCorrectAreSelected = correctIndices.value.every(index =>
        selectedImages.value.includes(index)
    );

    isSuccess.value = allSelectedAreCorrect && allCorrectAreSelected;
    showResult.value = true;
    isVerifying.value = false;
  }, 1000);
};

// Reset the captcha
const resetCaptcha = () => {
  topic = pickTopic();
  selectedImages.value = [];
  displayImages.value = generateCaptchaImages();

};

// Close the result modal
const closeResult = () => {
  showResult.value = false;
  if (isSuccess.value) {
    window.location.href = `${props.dest}`;
  } else {
    resetCaptcha();
  }
};
</script>