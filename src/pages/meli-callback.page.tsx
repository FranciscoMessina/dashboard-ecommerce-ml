import { Anchor, Center, Container, Stack, Text } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { Link, useSearchParams } from 'react-router-dom'


export default function MeliLink() {
   useDocumentTitle('Conectar a Mercado Libre')

   const [params, setParams] = useSearchParams()
   console.log(params)

   const error = params.get('error')

   return (
      <Container size="sm">
         <Center>
            <Stack sx={{ minHeight: '100vh' }} justify="center">
               {error ? (
                  <>
                     {error === 'access_denied' ? (
                        <Text align="center">
                           Rechazaste el acceso a Mercado Libre, estoy seguro de que fue por una muy buena
                           razon, si te arrepentis, podes volver a hacerlo{' '}
                           <Anchor component={Link} to="/auth/link-meli">
                              acá
                           </Anchor>
                           .
                        </Text>
                     ) : (
                        <Text align="center">
                           Algo salio mal, por favor volvé a intentarlo desde{' '}
                           <Anchor component={Link} to="/auth/link-meli">
                              acá
                           </Anchor>
                           .
                        </Text>
                     )}
                  </>
               ) : (
                  <Text align="center">
                     Listo ya esta conectada tu cuenta de Mercado Libre, podes usar la aplicación! Ir al{' '}
                     <Anchor component={Link} to="/">
                        inicio
                     </Anchor>
                     .
                  </Text>
               )}
            </Stack>
         </Center>
      </Container>
   )
}
