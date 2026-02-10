<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, SendHorizonal, Check } from "lucide-vue-next";

const currentStep = ref(1);
const selectedTime = ref<string | undefined>();

// Get day of week using standard JS numbering (0=Sunday, 1=Monday, ..., 6=Saturday)
const getJsDayOfWeek = (date: DateValue): number => {
  return date.toDate(getLocalTimeZone()).getDay();
};

// Calculate the minimum date (at least 3 business days from now)
const calculateMinDate = (): DateValue => {
  let date = today(getLocalTimeZone());
  let businessDays = 0;

  while (businessDays < 3) {
    date = date.add({ days: 1 });
    const dayOfWeek = getJsDayOfWeek(date);
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays++;
    }
  }

  // Now find the next available Wednesday, Thursday, or Friday
  while (true) {
    const dayOfWeek = getJsDayOfWeek(date);
    // 3 = Wednesday, 4 = Thursday, 5 = Friday
    if (dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5) {
      break;
    }
    date = date.add({ days: 1 });
  }

  return date;
};

const minDate = ref<DateValue>();
const maxDate = ref<DateValue>();
const selectedDate = ref<DateValue | undefined>();

onMounted(() => {
  minDate.value = calculateMinDate();
  maxDate.value = today(getLocalTimeZone()).add({ months: 2 });
  selectedDate.value = minDate.value;
});
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref("");

const formData = ref({
  name: "",
  company: "",
  email: "",
  phone: "",
});

const timeSlots = ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

const disabledDates = new Set([
  "2026-02-18",
  "2026-02-19",
  "2026-02-20",
  // Add more as needed
]);

// Function to check if a date is available (Wed, Thu, Fri only)
const isDateUnavailable = (date: DateValue): boolean => {
  const dayOfWeek = getJsDayOfWeek(date);
  // Block non Wed/Thu/Fri AND any manually disabled dates
  return (
    (dayOfWeek !== 3 && dayOfWeek !== 4 && dayOfWeek !== 5) || disabledDates.has(date.toString())
  );
};

const canProceedStep1 = computed(
  () => selectedDate.value !== undefined && selectedTime.value !== undefined,
);
const canSubmit = computed(() => {
  return (
    formData.value.name.trim() !== "" &&
    formData.value.company.trim() !== "" &&
    formData.value.email.trim() !== ""
  );
});

const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const formatDate = (date: DateValue): string => {
  const d = date.toDate(getLocalTimeZone());
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
};

const handleSubmit = async () => {
  if (!canSubmit.value || !selectedDate.value || !selectedTime.value) return;

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const dateStr = selectedDate.value.toString();

    const submitFormData = new FormData();
    submitFormData.append("name", formData.value.name);
    submitFormData.append("company", formData.value.company);
    submitFormData.append("email", formData.value.email);
    submitFormData.append("phone", formData.value.phone);
    submitFormData.append("date", dateStr);
    submitFormData.append("time", selectedTime.value);

    const { actions } = await import("astro:actions");
    const response = await actions.sendDemoRequest(submitFormData);

    if (response.error) {
      throw new Error(response.error.message);
    }

    isSubmitted.value = true;
  } catch (error) {
    errorMessage.value =
      "Er is iets fout gegaan. Probeer het opnieuw of neem contact op met hello@insync.insure";
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <!-- Success message -->
  <div v-if="isSubmitted" class="border rounded-3xl shadow-xl p-6 sm:p-8">
    <div class="text-center space-y-4">
      <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Check class="w-8 h-8 text-green-600" />
      </div>
      <h2 class="h3">Demo ingepland!</h2>
      <p class="text-muted-foreground">
        Dankjewel voor je aanvraag! We hebben je demo ingepland op
        <strong>{{ formatDate(selectedDate!) }}</strong> om <strong>{{ selectedTime }} uur</strong>.
      </p>
      <p class="text-muted-foreground">
        Je ontvangt een bevestiging per e-mail met meer informatie.
      </p>
    </div>
  </div>

  <!-- Wizard form -->
  <div v-else class="border rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
    <!-- Step 1: Date and time selection -->
    <div v-show="currentStep === 1">
      <h2 class="h3 mb-6">Kies een datum en tijd</h2>

      <div class="flex flex-col sm:flex-row gap-6">
        <!-- Calendar (left) -->
        <div class="flex justify-center">
          <Calendar
            v-model="selectedDate"
            :min-value="minDate"
            :max-value="maxDate"
            :is-date-unavailable="isDateUnavailable"
            :week-starts-on="1"
            locale="nl-NL"
            layout="month-and-year"
            class="rounded-lg border"
          />
        </div>

        <!-- Time slots (right, shown when date selected) -->
        <div class="flex-1 space-y-4">
          <div>
            <p class="text-sm font-medium mb-1">Geselecteerde datum</p>
            <p class="text-sm text-muted-foreground">
              {{
                selectedDate
                  ? formatDate(selectedDate).charAt(0).toUpperCase() +
                    formatDate(selectedDate).slice(1)
                  : "-"
              }}
            </p>
          </div>

          <div class="@container">
            <p class="text-sm font-medium">Kies een tijdstip</p>
            <div v-if="selectedDate" class="grid @min-[240px]:grid-cols-2 gap-2 mt-4">
              <button
                v-for="time in timeSlots"
                :key="time"
                type="button"
                class="h-10 rounded-lg border text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="[
                  selectedTime === time
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border',
                ]"
                @click="selectedTime = time"
              >
                {{ time }} uur
              </button>
            </div>
            <span v-else class="text-sm text-muted-foreground mt-1">Geen datum geselecteerd</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Contact details -->
    <div v-show="currentStep === 2">
      <h2 class="h3 mb-2">Vul je gegevens in</h2>
      <p class="text-sm text-muted-foreground">
        Demo op <strong>{{ selectedDate ? formatDate(selectedDate) : "" }}</strong> om
        <strong>{{ selectedTime }} uur</strong>
      </p>

      <div class="grid sm:grid-cols-2 gap-4 mt-4">
        <div class="space-y-1.5">
          <label for="name" class="inline-block text-sm font-medium"
            >Naam<span class="text-primary">*</span></label
          >
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="bg-background h-10 text-sm text-foreground rounded-lg border px-3 py-2 outline-ring placeholder:font-medium w-full"
          />
        </div>
        <div class="space-y-1.5">
          <label for="company" class="inline-block text-sm font-medium"
            >Bedrijfsnaam<span class="text-primary">*</span></label
          >
          <input
            id="company"
            v-model="formData.company"
            type="text"
            required
            class="bg-background h-10 text-sm text-foreground rounded-lg border px-3 py-2 outline-ring placeholder:font-medium w-full"
          />
        </div>
        <div class="space-y-1.5">
          <label for="email" class="inline-block text-sm font-medium"
            >E-mailadres<span class="text-primary">*</span></label
          >
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="bg-background h-10 text-sm text-foreground rounded-lg border px-3 py-2 outline-ring placeholder:font-medium w-full"
          />
        </div>
        <div class="space-y-1.5">
          <label for="phone" class="inline-block text-sm font-medium">Telefoonnummer</label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            class="bg-background h-10 text-sm text-foreground rounded-lg border px-3 py-2 outline-ring placeholder:font-medium w-full"
          />
        </div>
      </div>
    </div>

    <!-- Navigation buttons -->
    <div class="flex gap-3 pt-2">
      <Button
        v-if="currentStep > 1"
        type="button"
        variant="outline"
        class="flex-1"
        @click="prevStep"
      >
        <ChevronLeft class="size-5" />
        Vorige
      </Button>

      <Button
        v-if="currentStep < 2"
        type="button"
        class="flex-1"
        :disabled="!canProceedStep1"
        @click="nextStep"
      >
        Volgende
        <ChevronRight class="size-5" />
      </Button>

      <Button
        v-if="currentStep === 2"
        type="button"
        class="flex-1"
        :disabled="!canSubmit || isSubmitting"
        @click="handleSubmit"
      >
        <template v-if="isSubmitting"> Bezig met verzenden... </template>
        <template v-else>
          Demo aanvragen
          <SendHorizonal class="size-5" />
        </template>
      </Button>
    </div>

    <!-- Error message -->
    <p v-if="errorMessage" class="text-center text-destructive text-sm">
      {{ errorMessage }}
    </p>
  </div>
</template>
