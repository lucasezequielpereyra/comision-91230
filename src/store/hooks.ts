import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './index'

// Versiones tipadas de los hooks: en el resto de la app se usan estos
// en lugar de useDispatch/useSelector pelados, y TypeScript ya conoce
// la forma del estado y las acciones disponibles.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
