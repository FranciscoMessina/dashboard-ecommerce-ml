import { Box, Button, Center, Container, Stack, Text, useMantineTheme } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { MercadoLibreIcon } from '../components/SocialIcons/MercadoLibreIcon.js'
import { useAuth } from '../hooks/useAuth.js'

export default function MeliLink() {
  useDocumentTitle('Conectar a Mercado Libre')
  const { auth, setAuth } = useAuth()
  const theme = useMantineTheme()

  return (
    <Container fluid>
      <Center>
        <Stack sx={{ minHeight: '100vh' }} justify="center">
          <Text size="xl" align="center">
            Conecta tu cuenta de Mercado Libre
          </Text>
          <Button
            component="a"
            size="xl"
            href={`https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${
              import.meta.env.VITE_ML_CLIENT_ID
            }&state=${auth.userId}&redirect_uri=${import.meta.env.VITE_API_MELI_REDIRECT_URL}`}
            leftIcon={<MercadoLibreIcon />}
            style={{
              backgroundColor: theme.colors.yellow[5],
              color: theme.black
            }}
          >
            Conectar cuenta
          </Button>
        </Stack>
      </Center>
    </Container>
  )
}
