import { Center, Container, Group, Paper, Title } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { useState } from 'react'

export default  function Publicator() {
  useDocumentTitle('Publicar - El Rio Libros')
  const [data, setData] = useState({
    isbn: '',
    title: '',
    publisher: '',
    publishedDate: '',
    pageCount: '',
    authors: ['', ''],
    language: '',
    bookTitle: '',
    price: 0,
    genre: '',
    subgenre: '',
    cover: '',
    stock: 1,
    accesories: '',
    height: '',
    width: '',
    pocket: false,
    maxAge: '',
    minAge: '',
    narrationType: '',
    coloring: false,
    channels: ['marketplace', 'mshops']
  })

  return (
    <Container fluid>
      <Paper p="md" mb="xl" shadow="sm">
        <Title order={1}>Publicar </Title>
      </Paper>
      <Paper p="md" shadow="sm">
        <Center>
          <Group>
            <Container size="xl">{JSON.stringify(data)}</Container>
          </Group>
        </Center>
      </Paper>
    </Container>
  )
}
