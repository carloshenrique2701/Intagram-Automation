import os
import sys
from pathlib import Path

# Adicionar o diretório pai ao path para importar .env
sys.path.append(str(Path(__file__).parent.parent.parent))

from dotenv import load_dotenv
load_dotenv()

from instagrapi import Client
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    # Caminho absoluto para a imagem
    BASE_DIR = Path(__file__).parent
    IMAGE_PATH = BASE_DIR / "imgs" / "1048449.png"
    
    logger.info(f"Procurando imagem em: {IMAGE_PATH}")
    
    if not IMAGE_PATH.exists():
        logger.error(f"Imagem não encontrada: {IMAGE_PATH}")
        logger.info("Estrutura atual:")
        for root, dirs, files in os.walk(BASE_DIR.parent.parent):
            level = root.replace(str(BASE_DIR.parent.parent), '').count(os.sep)
            indent = ' ' * 2 * level
            print(f'{indent}{os.path.basename(root)}/')
            subindent = ' ' * 2 * (level + 1)
            for file in files:
                print(f'{subindent}{file}')
        return
    
    logger.info(f"Imagem encontrada: {IMAGE_PATH}")
    
    # Login
    cl = Client()
    cl.delay_range = [2, 5]
    
    try:
        # Tenta carregar sessão existente
        session_file = BASE_DIR.parent.parent / "session.json"
        if session_file.exists():
            cl.load_settings(str(session_file))
            logger.info("Sessão carregada")
        else:
            logger.info("Fazendo novo login...")
            cl.login(os.getenv('USERNAME'), os.getenv('PASSWORD'))
            cl.dump_settings(str(session_file))
            logger.info("Sessão salva")
        
        # Postar
        logger.info("Postando imagem...")
        media = cl.photo_upload(
            str(IMAGE_PATH),
            "Qallpaper do Palkia para PC #palkia #pokemon #lendario"
        )
        
        logger.info(f"✅ SUCESSO! Post publicado!")
        logger.info(f"📌 ID do post: {media.id}")
        logger.info(f"📊 Tipo: {media.media_type}")
        logger.info(f"🔗 URL: https://instagram.com/p/{media.code}")
        
    except Exception as e:
        logger.error(f"❌ Erro: {e}")

if __name__ == "__main__":
    main()