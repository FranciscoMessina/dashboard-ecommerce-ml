import { Container, Center, Group, Button, useMantineTheme } from '@mantine/core'
import { StatsGroup } from '../components/OrderStats'
import { MercadoLibreIcon } from '../components/SocialIcons/MercadoLibreIcon'
import { StatsRingCard } from '../components/StatsCard'
import { Layout } from '../components/Layout'
import { useDocumentTitle } from '@mantine/hooks'

const data = [
  {
    title: 'Page views',
    stats: '456,133',
    description: '24% more than in the same month last year, 33% more that two years ago'
  },
  {
    title: 'New users',
    stats: '2,175',
    description: '13% less compared to last month, new user engagement up by 6%'
  },
  {
    title: 'Completed orders',
    stats: '1,994',
    description: '1994 orders were completed this month, 97% satisfaction rate'
  }
]

const data2 = {
  title: 'Project tasks',
  completed: 1887,
  total: 2334,
  stats: [
    {
      value: 447,
      label: 'Remaining'
    },
    {
      value: 76,
      label: 'In progress'
    }
  ]
}

export function Home() {
  const theme = useMantineTheme()
  useDocumentTitle('El Rio Libros')

  return (
    <Container fluid>
      <Center>
        <Group direction="column" align="center">
          <StatsGroup data={data} />
          <Group position="apart" sx={{ width: '100%' }} grow noWrap>
            <StatsRingCard {...data2} />
            <StatsRingCard {...data2} />
            <StatsRingCard {...data2} />
          </Group>

          {true ? (
            <Button
              component="a"
              size="xl"
              href={`https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${
                import.meta.env.VITE_ML_CLIENT_ID
              }&state=${true}&redirect_uri=${import.meta.env.VITE_API_URL_HTTPS}ml`}
              target="_blank"
              rel="noreferrer"
              leftIcon={<MercadoLibreIcon />}
              style={{
                backgroundColor: theme.colors.yellow[5],
                color: theme.black
              }}
            >
              Link a Mercado Libre
            </Button>
          ) : (
            <Button component="a" variant="gradient" size="xl">
              Login
            </Button>
          )}
          {/* {status !== 'loading' && JSON.stringify(session, null, 2)}
              {status} */}
        </Group>
      </Center>
    </Container>
  )
}
