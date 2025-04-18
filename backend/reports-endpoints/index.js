const { throwError } = require('../commons/error');

module.exports = (app, db, helpers) => {
    
    // API endpoints
    const getReports = async (req, res) => {
        await helpers.waitForABit(1000);
        try {            
            // Fornecedores e o total de produtos relacionados
            const queryTotalProdutosPorFornecedor = `
                SELECT 
                    f.empresa,
                    (SELECT COUNT(0) FROM tbl_produto_fornecedor WHERE fornecedor_id = f.id) AS totalProdutos
                FROM tbl_fornecedores f
                WHERE (SELECT COUNT(0) FROM tbl_produto_fornecedor WHERE fornecedor_id = f.id) > 0
                ORDER BY (SELECT COUNT(0) FROM tbl_produto_fornecedor WHERE fornecedor_id = f.id) DESC
            `;

            const [totalProdutosPorFornecedor = results] = await db.query(queryTotalProdutosPorFornecedor);


            // Total fornecedores cadastrados no ultimo mes
            const queryFornecedoresRecentementeCriados = `
                SELECT COUNT(0) AS total
                FROM tbl_fornecedores f
                WHERE created_at >= (SELECT NOW() - INTERVAL 1 MONTH)
            `;

            const [totalFornecedoresRecentementeCriados = results] = await db.query(queryFornecedoresRecentementeCriados);


            // Total produtos cadastrados no ultimo mes
            const queryProdutosRecentementeCriados = `
                SELECT COUNT(0) as total
                FROM tbl_produtos f
                WHERE created_at >= (SELECT NOW() - INTERVAL 1 MONTH)
            `;

            const [totalProdutosRecentementeCriados = results] = await db.query(queryProdutosRecentementeCriados);


            // Entradas e saídas de estoque
            const queryEntradaSaidaProdutos = `
                SELECT 
                    DATE_FORMAT(created_at, "%Y-%m-%d") AS dayOfMonth,
                    tipo,
                    CAST(SUM(total) AS UNSIGNED) AS total
                FROM tbl_produto_estoque
                WHERE created_at >= (SELECT NOW() - INTERVAL 1 MONTH)
                GROUP BY dayOfMonth, tipo
                ORDER BY dayOfMonth;
            `;

            const [totalEntradaSaidaProdutos = results] = await db.query(queryEntradaSaidaProdutos);

            return res.status(200).json({
                totalFornecedoresRecentementeCriados: totalFornecedoresRecentementeCriados[0].total,
                totalProdutosRecentementeCriados: totalProdutosRecentementeCriados[0].total,
                totalProdutosPorFornecedor,
                totalEntradaSaidaProdutos,
            });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    app.get('/api/reports', getReports);

}