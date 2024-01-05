import { cva } from "../../../styled-system/css";

 
export const button = cva({
  base: {
    display: 'flex',
    fontWeight: 'bold',
    fontSize: 'md',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  variants: {
    visual: {
      solid: { bg: 'brand.primary', color: 'brand.tertiary', _hover: { filter: 'brightness(120%)'}, _active: {filter: 'brightness(90%)'} },
      outline: { borderWidth: '1px', borderColor: 'brand.secondary', color: 'brand.secondary', _hover: { filter: 'brightness(120%)'}, _active: {filter: 'brightness(90%)' }}
    },
    size: {
      sm: { padding: 2, fontSize: 'sm' },
      md: { padding: 4, fontSize: 'md' },
      lg: { padding: 6, fontSize: 'lg' }
    },
    borderRadius: {
      full: {borderRadius: 'full'}
    }
  }
})