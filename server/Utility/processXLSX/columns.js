module.exports = (product) => {
  switch (product) {
    default:
      return {
        Oportunidade: [
          {
            sheets_column: '%Desconto / Benefícios',
            internal_name: 'DescontoBeneficios',
            api_name: 'Percentual_Benef_cio',
            required: true
          },
          {
            sheets_column: 'Anos de contrato',
            internal_name: 'AnoContrato',
            api_name: 'Data_Limite_Renova_o',
            required: true
          },
          {
            sheets_column: '% Comissão',
            internal_name: 'Comissao',
            api_name: 'Comiss_o',
            required: true
          },
          {
            sheets_column: 'Produto',
            internal_name: 'Produto',
            api_name: 'Type',
            required: true
          },
          {
            sheets_column: 'Montante ano 1',
            internal_name: 'Montante',
            api_name: 'Amount',
            required: true
          },
          {
            sheets_column: 'Montante Total',
            internal_name: 'MontanteTotal',
            api_name: 'Montante_Total',
            required: true
          },
          /* {
            sheets_column: 'Frete Grátis',
            internal_name: 'Frete',
            api_name: 'Frete_Gr_tis',
            required: true
          }, */
          {
            sheets_column: 'SGE',
            internal_name: 'CodigoSGE',
            api_name: 'C_digo_SGE',
            required: true
          },
          {
            sheets_column: 'INEP',
            internal_name: 'CodigoINEP',
            api_name: 'C_digo_INEP',
            required: true
          },
          {
            sheets_column: 'Faturamento Bruto 1',
            internal_name: 'FaturamentoBruto_1',
            api_name: 'FaturamentoBruto_1',
            required: true
          },
          {
            sheets_column: 'Faturamento Bruto Total',
            internal_name: 'FaturamentoBruto_Total',
            api_name: 'FaturamentoBruto_Total',
            required: true
          },
          {
            sheets_column: 'Meio de Compra',
            internal_name: 'Meio_de_Compra',
            api_name: 'Meio_de_Compra',
            required: false
          },
          {
            sheets_column: 'Início da Fidelização',
            internal_name: 'Fidelizacao_Inicio',
            api_name: 'In_cio_da_Fideliza_o',
            required: true
          },
          {
            sheets_column: 'Término da Fidelização',
            internal_name: 'Fidelizacao_Termino',
            api_name: 'T_rmino_da_Fideliza_o',
            required: true
          },
          {
            sheets_column: 'Anos de contrato por extenso',
            internal_name: 'Anos_Contrato_Extenso',
            api_name: 'Anos_de_contrato_por_extenso',
            required: true
          },
          {
            sheets_column: 'Faturamento Líquido',
            internal_name: 'Faturamento_Liquido',
            api_name: 'Faturamento_L_quido',
            required: true
          },
          {
            sheets_column: 'Modelo de minuta',
            internal_name: 'Modelo_Minuta',
            api_name: 'Modelo_de_minuta',
            required: true
          },
          {
            sheets_column: 'Antecipação de pagamento',
            internal_name: 'Periodo_Concessao_Desconto',
            api_name: 'Per_odo_de_concess_o_do_desconto',
            required: true
          },
          {
            sheets_column: 'Tipo de Capa',
            internal_name: 'Tipo_Capa',
            api_name: 'Tipo_de_Capa',
            required: true
          },
          {
            sheets_column: 'Alçada para aprovação',
            internal_name: 'Alcada_Aprovacao',
            api_name: 'Al_ada_para_aprova_o',
            required: true
          },
          {
            sheets_column: 'Frete pedido principal',
            internal_name: 'Frete_Pedido_Principal',
            api_name: 'Frete_pedido_principal',
            required: true
          },
          {
            sheets_column: 'Frete pedido complementar',
            internal_name: 'Frete_Pedido_Complementar',
            api_name: 'Frete_pedido_complementar',
            required: true
          },
          {
            sheets_column: 'Forma de Pagamento',
            internal_name: 'Forma_Pagamento',
            api_name: 'Forma_de_Pagamento',
            required: true
          },
          {
            sheets_column: 'observacoes para aprovador',
            internal_name: 'Observacoes_Para_Aprovador',
            api_name: 'Observa_es_para_aprovador',
            required: true
          },
          {
            sheets_column: 'Faturamento Líq. Médio Programa (META)',
            internal_name: 'Faturamento_Liq_Medio_Programa_Meta',
            api_name: 'Faturamento_L_q_M_dio_Programa_META',
            required: true
          },
          {
            sheets_column: 'Alunado referência ano 1 (META)',
            internal_name: 'Alunado_Ref_Ano_1_Meta',
            api_name: 'Alunado_refer_ncia_ano_1_META',
            required: true
          },
          {
            sheets_column: '% Desconto Líquido Programa (CONTRATO TOTAL)',
            internal_name: 'Percent_Desconto_Liq_Programa_Contrato_Total',
            api_name: 'Desconto_L_quido_Programa_CONTRATO_TOTAL',
            required: true
          },
          {
            sheets_column: 'Projeção de faturamento Bruto - Repasse LNE',
            internal_name: 'Projecao_Faturamento_Bruto_Repasse_LNE',
            api_name: 'Proje_o_de_faturamento_Bruto_Repasse_LNE',
            required: true
          },
          {
            sheets_column: 'Projeção de faturamento Bruto - Custo LNE',
            internal_name: 'Projecao_Faturamento_Bruto_Custo_LNE',
            api_name: 'Proje_o_de_faturamento_Bruto_Custo_LNE',
            required: true
          },
          {
            sheets_column: 'Possui confissão de dívida?',
            internal_name: 'Possui_Confissao_Divida',
            api_name: 'Possui_confiss_o_de_d_vida',
            required: true
          },
          {
            sheets_column: 'Número de professores',
            internal_name: 'Numero_Professores',
            api_name: 'N_mero_de_professores',
            required: true
          },
        ],
        Produtos: [
          {
            sheets_column: 'Material',
            internal_name: 'Material',
            required: true
          },
          {
            sheets_column: 'Tipo',
            internal_name: 'Tipo',
            required: true
          },
          {
            sheets_column: 'Nível',
            internal_name: 'Nivel',
            required: true
          },
          {
            sheets_column: 'Ano/Série',
            internal_name: 'AnoSerie',
            required: true
          },
          {
            sheets_column: 'Número de alunos',
            internal_name: 'NumeroAlunos',
            required: true
          },
          {
            sheets_column: 'Ano',
            internal_name: 'Ano',
            required: true
          },
          {
            sheets_column: 'Desconto',
            internal_name: 'Desconto',
            required: true
          },
          {
            sheets_column: 'Montante',
            internal_name: 'Montante',
            required: true
          }
        ],
        Beneficios: [
          {
            sheets_column: 'Tipo de benefício',
            internal_name: 'Bonificacoes',
            required: true
          },
          {
            sheets_column: 'Cód Benefício',
            internal_name: 'CodBeneficio',
            required: false
          },
          {
            sheets_column: 'Descrição do benefício',
            internal_name: 'Observacao',
            required: true
          },
          {
            sheets_column: 'Valor Unitário',
            internal_name: 'ValorUnitario',
            required: true
          },
          {
            sheets_column: 'Quantidade',
            internal_name: 'Quantidade',
            required: true
          },
          {
            sheets_column: 'Ano',
            internal_name: 'Ano',
            required: true
          },
          {
            sheets_column: 'Valor Total',
            internal_name: 'ValorTotal',
            required: true
          },
          {
            sheets_column: '% Concessão',
            internal_name: 'Concessao',
            api_name: 'Concess_o',
            required: true
          },
          {
            sheets_column: 'Mês de Pagamento',
            internal_name: 'MesPagamento',
            api_name: 'M_s_de_pagamento',
            required: true
          }
        ],
        'Mapa escolar': [
          { sheets_column: 'Nível', internal_name: 'Nivel', required: true },
          { sheets_column: 'Preço Mensalidade', internal_name: 'PrecoMensalidade', required: true },
          { sheets_column: 'Venda para o Pai', internal_name: 'VendaParaPai', required: true },
          { sheets_column: 'Concorrente', internal_name: 'Concorrente', required: true },
          { sheets_column: 'Vencimento do contrato', internal_name: 'VencimentoContrato', required: true }
        ]
      };
      break;
  }
};
