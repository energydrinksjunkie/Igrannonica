using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations.Dataset
{
    public partial class Tags : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DatasetTag",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Tag = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatasetTag", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DatasetDatasetTag",
                columns: table => new
                {
                    DatasetsId = table.Column<int>(type: "integer", nullable: false),
                    TagsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatasetDatasetTag", x => new { x.DatasetsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_DatasetDatasetTag_Datasets_DatasetsId",
                        column: x => x.DatasetsId,
                        principalTable: "Datasets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DatasetDatasetTag_DatasetTag_TagsId",
                        column: x => x.TagsId,
                        principalTable: "DatasetTag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DatasetDatasetTag_TagsId",
                table: "DatasetDatasetTag",
                column: "TagsId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DatasetDatasetTag");

            migrationBuilder.DropTable(
                name: "DatasetTag");
        }
    }
}
