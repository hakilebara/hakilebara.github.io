<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="rss/channel/title"/></title>
        <style>
          body { font-family: sans-serif; margin: 40px; }
          h1 { color: #333; }
          .item { margin: 20px 0; padding: 10px; border-left: 3px solid #ccc; }
          .date { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1><xsl:value-of select="rss/channel/title"/></h1>
        <p><xsl:value-of select="rss/channel/description"/></p>
        
        <xsl:for-each select="rss/channel/item">
          <div class="item">
            <div class="date"><xsl:value-of select="pubDate"/></div>
            <div class="content"><xsl:value-of select="description"/></div>
            <a href="{link}">View post</a>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
