using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations.DatasetTag
{
    public partial class Tags3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DatasetDatasetTags",
                columns: table => new
                {
                    DatasetId = table.Column<int>(type: "integer", nullable: false),
                    DatasetTagId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatasetDatasetTags", x => new { x.DatasetId, x.DatasetTagId });
                    table.ForeignKey(
                        name: "FK_DatasetDatasetTags_Datasets_DatasetId",
                        column: x => x.DatasetId,
                        principalTable: "Datasets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DatasetDatasetTags_Tags_DatasetTagId",
                        column: x => x.DatasetTagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DatasetDatasetTags_DatasetTagId",
                table: "DatasetDatasetTags",
                column: "DatasetTagId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DatasetDatasetTags");
        }
    }
}
