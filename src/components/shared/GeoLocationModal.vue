<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { GeoLocationModalProps, Location } from '@/interfaces/Shared'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props

const props = withDefaults(defineProps<GeoLocationModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'update:location', value: Location): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)
const mapRef = ref<any>(null)
const map = ref<any>(null)
const marker = ref<any>(null)
const autoComplete = ref<any>(null)

const location = reactive<Location>({
  lat: props.location.lat || 24.774265,
  lng: props.location.lng || 46.738586,
  name: props.location.name,
})

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  libraries: ['places'],
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
onMounted(async () => {
  await loader.load()
  initGoogle()
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions

/**
 * @description This function is called when the user selects search for a location
 * @returns void
 */
function onPlaceChanged(): void {
  const { name, geometry } = autoComplete.value.getPlace()
  const lat = geometry.location.lat()
  const lng = geometry.location.lng()

  location.name = name
  location.lat = lat
  location.lng = lng
  marker.value.setPosition({
    lat,
    lng,
  })
  map.value.setCenter({
    lat,
    lng,
  })
}

/**
 * @description This function used to get the location name from the lat and lng
 * @param {number} lat
 * @param {number} lng
 * @returns void
 */
function getLocationName(lat: number, lng: number): void {
  const geocoder = new google.maps.Geocoder()
  const latLng = new google.maps.LatLng(lat, lng)

  geocoder.geocode(
    {
      location: latLng,
    },
    (results: any, status) => {
      if (status === 'OK' && results[0]) {
        const locationName = results[0].formatted_address

        location.name = locationName
      }
    },
  )
}

/**
 * @description This function used to initialize the google (with the map, marker, and autocomplete
 * @returns void
 */
function initGoogle(): void {
  const latLng = {
    lat: location.lat,
    lng: location.lng,
  }

  if (!location.name) getLocationName(location.lat, location.lng)

  map.value = new google.maps.Map(mapRef.value, {
    center: latLng,
    zoom: 15,
  })
  marker.value = new google.maps.Marker({
    position: latLng,
    map: map.value,
    draggable: true,
  })

  marker.value.addListener('dragend', () => {
    const position = marker.value.getPosition()

    location.lat = position.lat()
    location.lng = position.lng()
    map.value.setCenter(location)
    getLocationName(location.lat, location.lng)
  })

  autoComplete.value = new google.maps.places.Autocomplete(
    document.getElementById('autoCompleteRef') as HTMLInputElement,
  )
  autoComplete.value.addListener('place_changed', onPlaceChanged)
}

/**
 * @description This function used to get the user location using the browser geolocation
 */
async function getUserLocation() {
  if (!navigator.geolocation) {
    toast.error(t('errors.geo_location_error_msg'))

    return
  }

  try {
    const position: any = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true }),
    )

    const { latitude, longitude } = position.coords

    location.lat = latitude
    location.lng = longitude
    marker.value.setPosition({
      lat: latitude,
      lng: longitude,
    })
    map.value.setCenter({
      lat: latitude,
      lng: longitude,
    })
    getLocationName(latitude, longitude)
  } catch (error: any) {
    toast.error(error.message)
  }
}

// emit the location to the parent component and close the modal
function save() {
  showModal.value = false
  emit('update:location', location)
}

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="700" scrollable persistent eager class="map-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <div>
        <VCard title="حدد موقعك على الخريطة">
          <VCardText>
            <VTextField id="autoCompleteRef" v-model="location.name" placeholder="بحث">
              <template #append>
                <VBtn size="38" variant="outlined" @click="getUserLocation">
                  <VIcon icon=" tabler-current-location " size="22" />
                </VBtn>
              </template>
            </VTextField>
            <div ref="mapRef" class="map-container mt-3 mb-6" />
            <div class="d-flex justify-end flex-wrap gap-3">
              <VBtn variant="outlined" color="error" @click="showModal = false">
                {{ t('actions.cancel') }}
              </VBtn>
              <VBtn @click="save">
                {{ t('actions.save') }}
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.map-modal {
  .map-container {
    block-size: 300px;
    inline-size: 100%;
  }

  :deep(.v-input__append) {
    padding: 0;
    margin-inline-start: 10px;
  }
}

:global(.pac-container) {
  position: fixed !important;
  z-index: 9999 !important;
}
</style>
