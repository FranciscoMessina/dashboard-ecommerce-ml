import { Box, Button, Card, Center, Collapse, Container, Divider, Group, Paper, Space, Stack, Text, Title } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car, FileInvoice } from 'tabler-icons-react'
import { Invoice } from '../components/ui'

export default function Billing() {
   const navigate = useNavigate()

   useDocumentTitle('Facturas')

   useEffect(() => {
      navigate('/invoices/pending')
   }, [])


   return (

      <Box>
         <Invoice />
      </Box>

   )
}
