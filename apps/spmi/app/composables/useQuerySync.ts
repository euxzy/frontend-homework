import { reactive, watch } from 'vue'

export function useQuerySync<const Key extends string>(...keys: Key[]) {
	const route = useRoute()
	const router = useRouter()
	const params = reactive(Object.fromEntries(
		keys.map((key) => [key, typeof route.query[key] === 'string' ? route.query[key] : '']),
	)) as Record<Key, string>

	watch(params, (value) => {
		void router.replace({
			query: {
				...route.query,
				...Object.fromEntries(keys.map((key) => [key, value[key] || undefined])),
			},
		})
	}, { deep: true })

	watch(() => route.query, (query) => {
		for (const key of keys) {
			const value = typeof query[key] === 'string' ? query[key] : ''
			if (params[key] !== value) params[key] = value
		}
	})

	return params
}
