<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
                xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>ProTech HVAC - XML Sitemap</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          :root {
            --primary-color: #042F52;
            --secondary-color: #ED1C24;
            --background-color: #F5F5F5;
            --text-color: #333333;
            --link-color: #042F52;
            --link-hover-color: #ED1C24;
            --header-bg: #042F52;
            --header-text: white;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: var(--text-color);
            background: var(--background-color);
            line-height: 1.6;
            padding: 0;
            margin: 0;
          }
          a {
            color: var(--link-color);
            text-decoration: none;
          }
          a:hover {
            color: var(--link-hover-color);
            text-decoration: underline;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          .header {
            background: var(--header-bg);
            color: var(--header-text);
            padding: 30px 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.8;
          }
          .sitemap-stats {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
          .sitemap-stats h2 {
            margin-top: 0;
            color: var(--primary-color);
            font-size: 20px;
            font-weight: 600;
          }
          .sitemap-stats p {
            margin: 0;
            font-size: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
          th {
            background: var(--primary-color);
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 500;
            font-size: 14px;
          }
          td {
            padding: 12px;
            border-top: 1px solid #eeeeee;
            font-size: 14px;
            vertical-align: top;
          }
          tr:hover td {
            background: #f9f9f9;
          }
          .url-cell {
            word-break: break-all;
          }
          .footer {
            margin: 40px 0 20px;
            text-align: center;
            font-size: 14px;
            color: #777777;
          }
          .priority-high {
            color: #2E7D32;
            font-weight: bold;
          }
          .priority-medium {
            color: #F57C00;
          }
          .priority-low {
            color: #757575;
          }
          @media (max-width: 768px) {
            .container {
              padding: 0 10px;
            }
            th, td {
              padding: 8px;
              font-size: 13px;
            }
            .header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="container">
            <h1>ProTech HVAC XML Sitemap</h1>
            <p>This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs</p>
          </div>
        </div>
        <div class="container">
          <div class="sitemap-stats">
            <h2>Sitemap Information</h2>
            <p>This XML sitemap is used by search engines to efficiently crawl and index the pages on protech-ohio.com</p>
            <p>Last generated: <xsl:value-of select="format-dateTime(current-dateTime(), '[MNn] [D], [Y] at [h]:[m][P]')"/></p>
          </div>

          <table>
            <tr>
              <th>URL</th>
              <th>Priority</th>
              <th>Change Frequency</th>
              <th>Last Modified</th>
            </tr>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td class="url-cell">
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <xsl:choose>
                    <xsl:when test="sitemap:priority &gt;= 0.8">
                      <span class="priority-high"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:when test="sitemap:priority &gt;= 0.5">
                      <span class="priority-medium"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:otherwise>
                      <span class="priority-low"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
                <td>
                  <xsl:value-of select="sitemap:changefreq"/>
                </td>
                <td>
                  <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                </td>
              </tr>
            </xsl:for-each>
          </table>
          
          <div class="footer">
            <p>© <xsl:value-of select="year-from-dateTime(current-dateTime())"/> ProTech HVAC Services | Generated by Next.js</p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
