import {
  ActionIcon, Burger, Group,
  Header, MediaQuery, Text,
  useMantineColorScheme, useMantineTheme
} from '@mantine/core'
import { useRecoilState } from 'recoil'
import { MoonStars, Sun } from 'tabler-icons-react'
import { navbarAtom } from '../atoms/navbarAtom'
import { useGetQuestionsQuery } from '../hooks/useGetQuestionsQuery'


export function Topbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()

  const [open, setOpen] = useRecoilState(navbarAtom)

  const { data: questions } = useGetQuestionsQuery()


  return (
    <Header height={60}>
      <Group
        direction="row"
        position="apart"
        align={'center'}
        px="md"
        sx={{
          height: '100%'
        }}
      >
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={!open}
            onClick={() => setOpen(!open)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <MediaQuery smallerThan={'sm'} styles={{ display: 'none' }}>
          <Text
            size="xl"
            inline
            sx={{
              fontSize: '2.5rem',
              fontFamily: "'Playfair Display', 'serif'"
            }}
          >
            SuperApp
          </Text>
        </MediaQuery>

        <Group sx={{ marginRight: 4 }}>
          {/* {questions?.data.total! > 0 && (
            <Badge
              component={Link}
              to="questions"
              sx={(theme) => ({
                [theme.fn.smallerThan('md')]: {
                  display: 'none'
                }
              })}
            >
              Preguntas: {questions?.data.total}
            </Badge>
          )} */}
          <Group position="center">
            <ActionIcon
              onClick={() => toggleColorScheme()}
              size="lg"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6]
              })}
            >
              {colorScheme === 'dark' ? <Sun size={18} /> : <MoonStars size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </Group>
    </Header>
  )
}
