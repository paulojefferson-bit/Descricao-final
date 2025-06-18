import React from "react";
import { Container, Form, Button, Card } from "react-bootstrap";

const CriarConta = () => {
  return (
    <Container className="py-5 d-flex justify-content-center" fluid>
      <div style={{ width: '100%', maxWidth: '850px' }}>
        <h3 className="mb-4 fw-bold">Criar Conta</h3>

        <Card className="p-4 shadow-sm border-0">
          <Form>
            {/* Informações Pessoais */}
            <h6 className="mb-3 border-bottom pb-2 fw-bold">Informações Pessoais</h6>

            <Form.Group className="mb-3">
              <Form.Label>Nome Completo *</Form.Label>
              <Form.Control type="text" placeholder="Insira seu nome" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CPF *</Form.Label>
              <Form.Control type="text" placeholder="Insira seu CPF" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-mail *</Form.Label>
              <Form.Control type="email" placeholder="Insira seu email" />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Celular *</Form.Label>
              <Form.Control type="text" placeholder="Insira seu celular" />
            </Form.Group>

            {/* Informações de Entrega */}
            <h6 className="mb-3 border-bottom pb-2 fw-bold">Informações de Entrega</h6>

            <Form.Group className="mb-3">
              <Form.Label>Endereço *</Form.Label>
              <Form.Control type="text" placeholder="Insira seu endereço" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bairro *</Form.Label>
              <Form.Control type="text" placeholder="Insira seu bairro" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cidade *</Form.Label>
              <Form.Control type="text" placeholder="Insira sua cidade" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CEP *</Form.Label>
              <Form.Control type="text" placeholder="Insira seu CEP" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Complemento</Form.Label>
              <Form.Control type="text" placeholder="Insira complemento" />
            </Form.Group>

            {/* Checkbox */}
            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                id="ofertasEmail"
                label="Quero receber por email ofertas e novidades das lojas da Digital Store. A frequência de envios pode variar de acordo com a interação do cliente."
                defaultChecked
              />
            </Form.Group>

            {/* Botão */}
            <Button
              type="submit"
              variant="danger"
              className="w-100"
              style={{ backgroundColor: "#c71570", border: "none" }}
            >
              Criar Conta
            </Button>
          </Form>
        </Card>
      </div>
    </Container>
  );
};

export default CriarConta;
