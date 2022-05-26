import { Center, Container, Group, useMantineTheme } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { StatsGroup } from '../components/ui'
import { StatsRingCard } from '../components/ui'

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
   useDocumentTitle('Inicio')

   return (
      <Container fluid>
         <Center>
            <Group direction="column" align="center">
               <StatsGroup data={data} />

               <StatsRingCard {...data2} />
               <StatsRingCard {...data2} />
               <StatsRingCard {...data2} />
            </Group>
         </Center>
      </Container>
   )
}
