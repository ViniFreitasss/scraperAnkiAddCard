import dotenv from "dotenv";
import { Browser, Builder } from "selenium-webdriver";
import { click, processarArquivo, selectDropdown, write } from "./action";

(async function Main() {
    dotenv.config();
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    try {
        // Carregar perguntas e respostas
        const caminho =
            "C:/Users/vinif/Music/automations/RPAsAnki/scraperMasterAnkiCardAdd/data/note.txt";
        const { perguntas, respostas } = processarArquivo(caminho);

        if (perguntas.length === 0 || respostas.length === 0) {
            console.error("Nenhuma pergunta ou resposta encontrada no arquivo.");
            return;
        }

        await driver.get("https://ankiweb.net/decks");

        const username = process.env.USER;
        const password = process.env.PWD;
        const tipo_card = process.env.TIPO_CARD;
        const nome_deck = process.env.NOME_DECK;

        if (username && typeof username === "string") {
            await write(driver, "css", `[autocomplete='username']`, username);
            console.log(`O username é válido \n\r\r`);
        } else {
            return new Error("O username é inválido !");
        }

        if (password && typeof password === "string") {
            await write(driver, "css", `[autocomplete='current-password']`, password);
            console.log(`A password é válida \n\r\r`);
        } else {
            return new Error("A password é inválida !");
        }

        await click(driver, "css", ".btn-lg");
        await driver.sleep(2000);

        await click(
            driver,
            "xpath",
            '//*[@id="navbarSupportedContent"]/ul[1]/li[2]/a',
        );

        if (tipo_card && typeof tipo_card === "string") {
            await selectDropdown(driver, "input", tipo_card, null);
            console.log(`O tipo é válido \n\r\r`);
        } else {
            return new Error("O tipo é inválido !");
        }

        if (nome_deck && typeof nome_deck === "string") {
            await selectDropdown(
                driver,
                "input",
                nome_deck,
                `return document.querySelector("body > div > main > div.form-group.row.mt-2.mb-4 > div > div > div.value-container.svelte-82qwg8 > input")`,
            );
            console.log(`O deck é válido \n\r\r`);
        } else {
            return new Error("O deck é inválido !");
        }

        let i = 0;
        while (i < perguntas.length) {
            const pergunta = perguntas[i];
            const resposta = respostas[i];

            await write(
                driver,
                "css",
                "form div:nth-child(1) div div",
                `${pergunta}`,
            );
            await write(
                driver,
                "css",
                "form div:nth-child(2) div div",
                `${resposta}`,
            );
            await click(driver, "xpath", "/html/body/div/main/form/button");
            await driver.sleep(2000);
            i++;
        }
    } catch (e) {
        console.error(e);
    } finally {
        await driver.sleep(3000);
        await driver.quit();
    }
})();
